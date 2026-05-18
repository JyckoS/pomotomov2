import "server-only";

import {
  and,
  count,
  desc,
  eq,
  gt,
  gte,
  ilike,
  inArray,
  isNull,
  or,
  sql,
} from "drizzle-orm";

import { db } from "@/db";
import { conversationMessage, conversationParticipant, friendship, user, userHeartbeat } from "@/db/schema";
import { getUserAvatarSrc } from "@/lib/avatar/user-avatar";

const ONLINE_WINDOW_SECONDS = 60;
const FRIENDS_PAGE_SIZE = 20;
const REQUEST_RATE_LIMIT_PER_MINUTE = 20;

type FriendshipRow = {
  id: string;
  requesterId: string;
  receiverId: string;
  status: string;
  statusBeforeBlock: string | null;
  blockedByUserId: string | null;
  conversationId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

function ensureNotSelf(userId: string, targetUserId: string) {
  if (userId === targetUserId) {
    throw new Error("You cannot perform this action on yourself.");
  }
}

async function getRelationshipRow(userId: string, targetUserId: string): Promise<FriendshipRow | null> {
  const result = await db
    .select({
      id: friendship.id,
      requesterId: friendship.requesterId,
      receiverId: friendship.receiverId,
      status: friendship.status,
      statusBeforeBlock: friendship.statusBeforeBlock,
      blockedByUserId: friendship.blockedByUserId,
      conversationId: friendship.conversationId,
      createdAt: friendship.createdAt,
      updatedAt: friendship.updatedAt,
    })
    .from(friendship)
    .where(
      or(
        and(eq(friendship.requesterId, userId), eq(friendship.receiverId, targetUserId)),
        and(eq(friendship.requesterId, targetUserId), eq(friendship.receiverId, userId)),
      ),
    )
    .orderBy(desc(friendship.updatedAt))
    .limit(1);

  return result[0] ?? null;
}

async function getUnreadCountForConversation(conversationId: string, userId: string) {
  const participant = await db
    .select({ lastReadAt: conversationParticipant.lastReadAt })
    .from(conversationParticipant)
    .where(
      and(
        eq(conversationParticipant.conversationId, conversationId),
        eq(conversationParticipant.userId, userId),
      ),
    )
    .limit(1);

  const lastReadAt = participant[0]?.lastReadAt ?? null;
  const unread = await db
    .select({ total: count() })
    .from(conversationMessage)
    .where(
      and(
        eq(conversationMessage.conversationId, conversationId),
        sql`${conversationMessage.senderId} <> ${userId}`,
        lastReadAt ? gte(conversationMessage.createdAt, lastReadAt) : sql`TRUE`,
      ),
    );

  return unread[0]?.total ?? 0;
}

function computeRelationshipState({
  relationship,
  currentUserId,
  candidateUserId,
}: {
  relationship: FriendshipRow | null;
  currentUserId: string;
  candidateUserId: string;
}) {
  if (!relationship) return "none" as const;
  if (relationship.status === "blocked") {
    if (relationship.blockedByUserId === currentUserId) return "blocked_by_you" as const;
    if (relationship.blockedByUserId === candidateUserId) return "blocked_by_them" as const;
  }

  if (relationship.status === "accepted") return "friend" as const;
  if (relationship.status === "pending" && relationship.requesterId === currentUserId) {
    return "outgoing_pending" as const;
  }
  if (relationship.status === "pending" && relationship.receiverId === currentUserId) {
    return "incoming_pending" as const;
  }

  return "none" as const;
}

export async function listFriends({
  userId,
  page = 1,
  pageSize = FRIENDS_PAGE_SIZE,
}: {
  userId: string;
  page?: number;
  pageSize?: number;
}) {
  const normalizedPage = Math.max(1, page);
  const normalizedPageSize = Math.min(50, Math.max(1, pageSize));

  const acceptedRelationships = await db
    .select({
      id: friendship.id,
      requesterId: friendship.requesterId,
      receiverId: friendship.receiverId,
      conversationId: friendship.conversationId,
    })
    .from(friendship)
    .where(
      and(
        eq(friendship.status, "accepted"),
        isNull(friendship.blockedByUserId),
        or(eq(friendship.requesterId, userId), eq(friendship.receiverId, userId)),
      ),
    )
    .orderBy(desc(friendship.updatedAt));

  const friendIds = acceptedRelationships.map((relationship) =>
    relationship.requesterId === userId ? relationship.receiverId : relationship.requesterId,
  );

  if (friendIds.length === 0) {
    return {
      items: [],
      page: normalizedPage,
      pageSize: normalizedPageSize,
      total: 0,
      hasNextPage: false,
    };
  }

  const [friendUsers, heartbeats] = await Promise.all([
    db
      .select({
        id: user.id,
        name: user.name,
        status: user.status,
        image: user.image,
      })
      .from(user)
      .where(inArray(user.id, friendIds)),
    db
      .select({
        userId: userHeartbeat.userId,
        lastHeartbeatAt: userHeartbeat.lastHeartbeatAt,
      })
      .from(userHeartbeat)
      .where(inArray(userHeartbeat.userId, friendIds)),
  ]);

  const heartbeatByUserId = new Map(heartbeats.map((heartbeat) => [heartbeat.userId, heartbeat.lastHeartbeatAt]));
  const relationshipByFriendId = new Map(
    acceptedRelationships.map((relationship) => [
      relationship.requesterId === userId ? relationship.receiverId : relationship.requesterId,
      relationship,
    ]),
  );

  const now = Date.now();
  const withStatus = friendUsers
    .map((friendUser) => {
      const relationship = relationshipByFriendId.get(friendUser.id);
      if (!relationship) return null;

      const lastHeartbeatAt = heartbeatByUserId.get(friendUser.id) ?? null;
      const isOnline =
        lastHeartbeatAt !== null && now - lastHeartbeatAt.getTime() <= ONLINE_WINDOW_SECONDS * 1000;

      return {
        friendshipId: relationship.id,
        userId: friendUser.id,
        name: friendUser.name,
        status: friendUser.status,
        avatarSrc: getUserAvatarSrc(friendUser.id, friendUser.image),
        isOnline,
        lastHeartbeatAt: lastHeartbeatAt ? lastHeartbeatAt.toISOString() : null,
        conversationId: relationship.conversationId,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .sort((a, b) => {
      if (a.isOnline !== b.isOnline) return a.isOnline ? -1 : 1;
      if (a.lastHeartbeatAt && b.lastHeartbeatAt) return b.lastHeartbeatAt.localeCompare(a.lastHeartbeatAt);
      if (a.lastHeartbeatAt) return -1;
      if (b.lastHeartbeatAt) return 1;
      return a.name.localeCompare(b.name);
    });

  const start = (normalizedPage - 1) * normalizedPageSize;
  const pagedItems = withStatus.slice(start, start + normalizedPageSize);

  const itemsWithUnread = await Promise.all(
    pagedItems.map(async (item) => ({
      ...item,
      unreadCount: item.conversationId ? await getUnreadCountForConversation(item.conversationId, userId) : 0,
    })),
  );

  return {
    items: itemsWithUnread,
    page: normalizedPage,
    pageSize: normalizedPageSize,
    total: withStatus.length,
    hasNextPage: start + normalizedPageSize < withStatus.length,
  };
}

export async function searchUsersForFriends({
  userId,
  query,
  page = 1,
  pageSize = FRIENDS_PAGE_SIZE,
}: {
  userId: string;
  query: string;
  page?: number;
  pageSize?: number;
}) {
  const normalizedPage = Math.max(1, page);
  const normalizedPageSize = Math.min(50, Math.max(1, pageSize));
  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    return {
      items: [],
      page: normalizedPage,
      pageSize: normalizedPageSize,
      total: 0,
      hasNextPage: false,
    };
  }

  const usersResult = await db
    .select({
      id: user.id,
      name: user.name,
      image: user.image,
    })
    .from(user)
    .where(and(ilike(user.name, `%${normalizedQuery}%`), sql`${user.id} <> ${userId}`))
    .orderBy(user.name)
    .limit(normalizedPageSize + 1)
    .offset((normalizedPage - 1) * normalizedPageSize);

  const hasNextPage = usersResult.length > normalizedPageSize;
  const pageUsers = hasNextPage ? usersResult.slice(0, normalizedPageSize) : usersResult;
  const candidateIds = pageUsers.map((candidate) => candidate.id);

  const relationships =
    candidateIds.length === 0
      ? []
      : await db
          .select({
            id: friendship.id,
            requesterId: friendship.requesterId,
            receiverId: friendship.receiverId,
            status: friendship.status,
            statusBeforeBlock: friendship.statusBeforeBlock,
            blockedByUserId: friendship.blockedByUserId,
            conversationId: friendship.conversationId,
            createdAt: friendship.createdAt,
            updatedAt: friendship.updatedAt,
          })
          .from(friendship)
          .where(
            or(
              and(eq(friendship.requesterId, userId), inArray(friendship.receiverId, candidateIds)),
              and(eq(friendship.receiverId, userId), inArray(friendship.requesterId, candidateIds)),
            ),
          );

  const relationshipByCandidateId = new Map<string, FriendshipRow>();
  for (const relationship of relationships) {
    const candidateId = relationship.requesterId === userId ? relationship.receiverId : relationship.requesterId;
    if (!relationshipByCandidateId.has(candidateId)) {
      relationshipByCandidateId.set(candidateId, relationship);
    }
  }

  return {
    items: pageUsers.map((candidate) => {
      const relationship = relationshipByCandidateId.get(candidate.id) ?? null;

      return {
        userId: candidate.id,
        name: candidate.name,
        avatarSrc: getUserAvatarSrc(candidate.id, candidate.image),
        relationshipState: computeRelationshipState({
          relationship,
          currentUserId: userId,
          candidateUserId: candidate.id,
        }),
      };
    }),
    page: normalizedPage,
    pageSize: normalizedPageSize,
    total: hasNextPage ? normalizedPage * normalizedPageSize + 1 : (normalizedPage - 1) * normalizedPageSize + pageUsers.length,
    hasNextPage,
  };
}

export async function listFriendRequests({
  userId,
  page = 1,
  pageSize = FRIENDS_PAGE_SIZE,
}: {
  userId: string;
  page?: number;
  pageSize?: number;
}) {
  const normalizedPage = Math.max(1, page);
  const normalizedPageSize = Math.min(50, Math.max(1, pageSize));
  const offset = (normalizedPage - 1) * normalizedPageSize;

  const [incomingRows, outgoingRows, incomingTotal, outgoingTotal] = await Promise.all([
    db
      .select({
        friendshipId: friendship.id,
        createdAt: friendship.createdAt,
        userId: user.id,
        name: user.name,
        image: user.image,
      })
      .from(friendship)
      .innerJoin(user, eq(user.id, friendship.requesterId))
      .where(
        and(
          eq(friendship.receiverId, userId),
          eq(friendship.status, "pending"),
          isNull(friendship.blockedByUserId),
        ),
      )
      .orderBy(desc(friendship.createdAt))
      .limit(normalizedPageSize)
      .offset(offset),
    db
      .select({
        friendshipId: friendship.id,
        createdAt: friendship.createdAt,
        userId: user.id,
        name: user.name,
        image: user.image,
      })
      .from(friendship)
      .innerJoin(user, eq(user.id, friendship.receiverId))
      .where(
        and(
          eq(friendship.requesterId, userId),
          eq(friendship.status, "pending"),
          isNull(friendship.blockedByUserId),
        ),
      )
      .orderBy(desc(friendship.createdAt))
      .limit(normalizedPageSize)
      .offset(offset),
    db
      .select({ total: count() })
      .from(friendship)
      .where(
        and(
          eq(friendship.receiverId, userId),
          eq(friendship.status, "pending"),
          isNull(friendship.blockedByUserId),
        ),
      ),
    db
      .select({ total: count() })
      .from(friendship)
      .where(
        and(
          eq(friendship.requesterId, userId),
          eq(friendship.status, "pending"),
          isNull(friendship.blockedByUserId),
        ),
      ),
  ]);

  return {
    incoming: incomingRows.map((row) => ({
      friendshipId: row.friendshipId,
      userId: row.userId,
      name: row.name,
      avatarSrc: getUserAvatarSrc(row.userId, row.image),
      createdAt: row.createdAt.toISOString(),
    })),
    outgoing: outgoingRows.map((row) => ({
      friendshipId: row.friendshipId,
      userId: row.userId,
      name: row.name,
      avatarSrc: getUserAvatarSrc(row.userId, row.image),
      createdAt: row.createdAt.toISOString(),
    })),
    page: normalizedPage,
    pageSize: normalizedPageSize,
    incomingTotal: incomingTotal[0]?.total ?? 0,
    outgoingTotal: outgoingTotal[0]?.total ?? 0,
  };
}

export async function sendFriendRequest({
  userId,
  targetUserId,
}: {
  userId: string;
  targetUserId: string;
}) {
  ensureNotSelf(userId, targetUserId);

  const [targetUser] = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.id, targetUserId))
    .limit(1);

  if (!targetUser) {
    throw new Error("User not found.");
  }

  const oneMinuteAgo = new Date(Date.now() - 60_000);
  const requestCount = await db
    .select({ total: count() })
    .from(friendship)
    .where(
      and(
        eq(friendship.requesterId, userId),
        eq(friendship.status, "pending"),
        gte(friendship.createdAt, oneMinuteAgo),
      ),
    );

  if ((requestCount[0]?.total ?? 0) >= REQUEST_RATE_LIMIT_PER_MINUTE) {
    throw new Error("Too many friend requests. Please try again in a minute.");
  }

  const relationship = await getRelationshipRow(userId, targetUserId);
  if (!relationship) {
    await db.insert(friendship).values({
      requesterId: userId,
      receiverId: targetUserId,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return { state: "pending" as const };
  }

  if (relationship.status === "blocked" && relationship.blockedByUserId === targetUserId) {
    throw new Error("You cannot send a request to this user.");
  }
  if (relationship.status === "blocked" && relationship.blockedByUserId === userId) {
    throw new Error("Unblock this user first.");
  }
  if (relationship.status === "accepted") {
    return { state: "already_friends" as const };
  }
  if (relationship.status === "pending" && relationship.requesterId === userId) {
    return { state: "already_pending" as const };
  }
  if (relationship.status === "pending" && relationship.receiverId === userId) {
    await db
      .update(friendship)
      .set({
        status: "accepted",
        blockedByUserId: null,
        statusBeforeBlock: null,
        updatedAt: new Date(),
      })
      .where(eq(friendship.id, relationship.id));

    return { state: "accepted" as const };
  }

  throw new Error("Unable to send request.");
}

export async function acceptFriendRequest({
  userId,
  friendshipId,
}: {
  userId: string;
  friendshipId: string;
}) {
  const relationship = await db
    .select({
      id: friendship.id,
      receiverId: friendship.receiverId,
      status: friendship.status,
      blockedByUserId: friendship.blockedByUserId,
    })
    .from(friendship)
    .where(eq(friendship.id, friendshipId))
    .limit(1);

  const current = relationship[0];
  if (!current) throw new Error("Request not found.");
  if (current.receiverId !== userId) throw new Error("Not allowed.");
  if (current.status !== "pending" || current.blockedByUserId !== null) {
    throw new Error("Request is not pending.");
  }

  await db
    .update(friendship)
    .set({
      status: "accepted",
      statusBeforeBlock: null,
      updatedAt: new Date(),
    })
    .where(eq(friendship.id, friendshipId));
}

export async function declineFriendRequest({
  userId,
  friendshipId,
}: {
  userId: string;
  friendshipId: string;
}) {
  const relationship = await db
    .select({
      id: friendship.id,
      receiverId: friendship.receiverId,
      status: friendship.status,
    })
    .from(friendship)
    .where(eq(friendship.id, friendshipId))
    .limit(1);

  const current = relationship[0];
  if (!current) throw new Error("Request not found.");
  if (current.receiverId !== userId) throw new Error("Not allowed.");
  if (current.status !== "pending") throw new Error("Request is not pending.");

  await db.delete(friendship).where(eq(friendship.id, friendshipId));
}

export async function blockUser({
  userId,
  targetUserId,
}: {
  userId: string;
  targetUserId: string;
}) {
  ensureNotSelf(userId, targetUserId);

  const relationship = await getRelationshipRow(userId, targetUserId);
  if (!relationship) {
    await db.insert(friendship).values({
      requesterId: userId,
      receiverId: targetUserId,
      status: "blocked",
      statusBeforeBlock: "pending",
      blockedByUserId: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return;
  }

  await db
    .update(friendship)
    .set({
      statusBeforeBlock:
        relationship.status === "blocked" ? relationship.statusBeforeBlock : relationship.status,
      status: "blocked",
      blockedByUserId: userId,
      updatedAt: new Date(),
    })
    .where(eq(friendship.id, relationship.id));
}

export async function unblockUser({
  userId,
  targetUserId,
}: {
  userId: string;
  targetUserId: string;
}) {
  ensureNotSelf(userId, targetUserId);

  const relationship = await getRelationshipRow(userId, targetUserId);
  if (!relationship || relationship.status !== "blocked" || relationship.blockedByUserId !== userId) {
    throw new Error("You have not blocked this user.");
  }

  await db
    .update(friendship)
    .set({
      status: relationship.statusBeforeBlock ?? "pending",
      statusBeforeBlock: null,
      blockedByUserId: null,
      updatedAt: new Date(),
    })
    .where(eq(friendship.id, relationship.id));
}

export async function getAcceptedFriendshipBetweenUsers({
  userId,
  targetUserId,
}: {
  userId: string;
  targetUserId: string;
}) {
  ensureNotSelf(userId, targetUserId);

  const relationship = await getRelationshipRow(userId, targetUserId);
  if (!relationship) return null;
  if (relationship.status !== "accepted") return null;
  if (relationship.blockedByUserId !== null) return null;
  return relationship;
}

export async function setFriendshipConversationId({
  friendshipId,
  conversationId,
}: {
  friendshipId: string;
  conversationId: string;
}) {
  await db
    .update(friendship)
    .set({
      conversationId,
      updatedAt: new Date(),
    })
    .where(eq(friendship.id, friendshipId));
}

export async function getTotalUnreadFriendMessages({ userId }: { userId: string }) {
  const unread = await db
    .select({ total: count() })
    .from(conversationParticipant)
    .innerJoin(
      conversationMessage,
      eq(conversationMessage.conversationId, conversationParticipant.conversationId),
    )
    .innerJoin(
      friendship,
      and(
        eq(friendship.conversationId, conversationParticipant.conversationId),
        eq(friendship.status, "accepted"),
        isNull(friendship.blockedByUserId),
        or(eq(friendship.requesterId, userId), eq(friendship.receiverId, userId)),
      ),
    )
    .where(
      and(
        eq(conversationParticipant.userId, userId),
        sql`${conversationMessage.senderId} <> ${userId}`,
        or(
          isNull(conversationParticipant.lastReadAt),
          gt(conversationMessage.createdAt, conversationParticipant.lastReadAt),
        ),
      ),
    );

  return unread[0]?.total ?? 0;
}
