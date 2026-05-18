import "server-only";

import { and, count, desc, eq, gte, inArray, lt } from "drizzle-orm";

import { db } from "@/db";
import { conversation, conversationMessage, conversationParticipant, user } from "@/db/schema";
import { getUserAvatarSrc } from "@/lib/avatar/user-avatar";
import {
  getAcceptedFriendshipBetweenUsers,
  setFriendshipConversationId,
} from "@/lib/data-access/friends";

const MESSAGE_RATE_LIMIT_PER_MINUTE = 60;
const DEFAULT_MESSAGE_PAGE_SIZE = 30;

export async function ensureDirectConversation({
  userId,
  friendUserId,
}: {
  userId: string;
  friendUserId: string;
}) {
  const relationship = await getAcceptedFriendshipBetweenUsers({
    userId,
    targetUserId: friendUserId,
  });

  if (!relationship) {
    throw new Error("You can only chat with accepted friends.");
  }

  if (relationship.conversationId) {
    return relationship.conversationId;
  }

  const [createdConversation] = await db
    .insert(conversation)
    .values({
      type: "direct",
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning({ id: conversation.id });

  if (!createdConversation) {
    throw new Error("Could not start conversation.");
  }

  await db.insert(conversationParticipant).values([
    {
      conversationId: createdConversation.id,
      userId,
      joinedAt: new Date(),
      lastReadAt: new Date(),
    },
    {
      conversationId: createdConversation.id,
      userId: friendUserId,
      joinedAt: new Date(),
      lastReadAt: null,
    },
  ]);

  await setFriendshipConversationId({
    friendshipId: relationship.id,
    conversationId: createdConversation.id,
  });

  return createdConversation.id;
}

export async function getConversationDetails({
  conversationId,
  userId,
  pageSize = DEFAULT_MESSAGE_PAGE_SIZE,
  before,
}: {
  conversationId: string;
  userId: string;
  pageSize?: number;
  before?: Date | null;
}) {
  const [participant] = await db
    .select({
      conversationId: conversationParticipant.conversationId,
      userId: conversationParticipant.userId,
    })
    .from(conversationParticipant)
    .where(
      and(
        eq(conversationParticipant.conversationId, conversationId),
        eq(conversationParticipant.userId, userId),
      ),
    )
    .limit(1);

  if (!participant) {
    throw new Error("Conversation not found.");
  }

  const participants = await db
    .select({
      userId: conversationParticipant.userId,
    })
    .from(conversationParticipant)
    .where(eq(conversationParticipant.conversationId, conversationId));

  const participantIds = participants.map((item) => item.userId);
  const users = await db
    .select({
      id: user.id,
      name: user.name,
      image: user.image,
    })
    .from(user)
    .where(inArray(user.id, participantIds));

  const usersById = new Map(users.map((item) => [item.id, item]));
  const otherParticipantId = participantIds.find((id) => id !== userId) ?? userId;
  const otherParticipant = usersById.get(otherParticipantId);
  if (!otherParticipant) {
    throw new Error("Conversation participant was not found.");
  }

  const normalizedPageSize = Math.min(100, Math.max(1, pageSize));
  const messageWhere = before
    ? and(eq(conversationMessage.conversationId, conversationId), lt(conversationMessage.createdAt, before))
    : eq(conversationMessage.conversationId, conversationId);

  const rows = await db
    .select({
      id: conversationMessage.id,
      senderId: conversationMessage.senderId,
      content: conversationMessage.content,
      createdAt: conversationMessage.createdAt,
      editedAt: conversationMessage.editedAt,
      deletedAt: conversationMessage.deletedAt,
    })
    .from(conversationMessage)
    .where(messageWhere)
    .orderBy(desc(conversationMessage.createdAt))
    .limit(normalizedPageSize + 1);

  const hasMore = rows.length > normalizedPageSize;
  const pageRows = hasMore ? rows.slice(0, normalizedPageSize) : rows;
  const messages = pageRows
    .reverse()
    .map((row) => {
      const sender = usersById.get(row.senderId);

      return {
        id: row.id,
        senderId: row.senderId,
        senderName: sender?.name ?? "Unknown",
        senderAvatarSrc: sender ? getUserAvatarSrc(sender.id, sender.image) : null,
        content: row.content,
        createdAt: row.createdAt.toISOString(),
        editedAt: row.editedAt ? row.editedAt.toISOString() : null,
        deletedAt: row.deletedAt ? row.deletedAt.toISOString() : null,
      };
    });

  await db
    .update(conversationParticipant)
    .set({
      lastReadAt: new Date(),
    })
    .where(
      and(
        eq(conversationParticipant.conversationId, conversationId),
        eq(conversationParticipant.userId, userId),
      ),
    );

  return {
    conversationId,
    currentUserId: userId,
    otherParticipant: {
      userId: otherParticipant.id,
      name: otherParticipant.name,
      avatarSrc: getUserAvatarSrc(otherParticipant.id, otherParticipant.image),
    },
    messages,
    hasMore,
    oldestMessageAt: messages[0]?.createdAt ?? null,
  };
}

export async function sendConversationMessage({
  conversationId,
  userId,
  content,
}: {
  conversationId: string;
  userId: string;
  content: string;
}) {
  const normalizedContent = content.trim();
  if (!normalizedContent) {
    throw new Error("Message cannot be empty.");
  }
  if (normalizedContent.length > 2000) {
    throw new Error("Message is too long.");
  }

  const [participant] = await db
    .select({
      conversationId: conversationParticipant.conversationId,
    })
    .from(conversationParticipant)
    .where(
      and(
        eq(conversationParticipant.conversationId, conversationId),
        eq(conversationParticipant.userId, userId),
      ),
    )
    .limit(1);

  if (!participant) {
    throw new Error("Conversation not found.");
  }

  const oneMinuteAgo = new Date(Date.now() - 60_000);
  const [messagesInLastMinute] = await db
    .select({ total: count() })
    .from(conversationMessage)
    .where(and(eq(conversationMessage.senderId, userId), gte(conversationMessage.createdAt, oneMinuteAgo)));

  if ((messagesInLastMinute?.total ?? 0) >= MESSAGE_RATE_LIMIT_PER_MINUTE) {
    throw new Error("Too many messages. Please wait a moment.");
  }

  const [created] = await db
    .insert(conversationMessage)
    .values({
      conversationId,
      senderId: userId,
      content: normalizedContent,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning({
      id: conversationMessage.id,
      senderId: conversationMessage.senderId,
      content: conversationMessage.content,
      createdAt: conversationMessage.createdAt,
    });

  await db
    .update(conversation)
    .set({
      updatedAt: new Date(),
    })
    .where(eq(conversation.id, conversationId));

  await db
    .update(conversationParticipant)
    .set({
      lastReadAt: new Date(),
    })
    .where(
      and(
        eq(conversationParticipant.conversationId, conversationId),
        eq(conversationParticipant.userId, userId),
      ),
    );

  return {
    id: created.id,
    senderId: created.senderId,
    content: created.content,
    createdAt: created.createdAt.toISOString(),
  };
}
