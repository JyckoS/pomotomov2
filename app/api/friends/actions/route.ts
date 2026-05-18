import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth";
import {
  acceptFriendRequest,
  blockUser,
  declineFriendRequest,
  sendFriendRequest,
  unblockUser,
} from "@/lib/data-access/friends";

const actionSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("send_request"),
    targetUserId: z.string().min(1),
  }),
  z.object({
    action: z.literal("accept_request"),
    friendshipId: z.string().uuid(),
  }),
  z.object({
    action: z.literal("decline_request"),
    friendshipId: z.string().uuid(),
  }),
  z.object({
    action: z.literal("block_user"),
    targetUserId: z.string().min(1),
  }),
  z.object({
    action: z.literal("unblock_user"),
    targetUserId: z.string().min(1),
  }),
]);

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsedBody = actionSchema.safeParse(body);
  if (!parsedBody.success) {
    return NextResponse.json(
      {
        error: "Invalid friend action payload.",
        details: parsedBody.error.flatten(),
      },
      { status: 400 },
    );
  }

  try {
    if (parsedBody.data.action === "send_request") {
      const result = await sendFriendRequest({
        userId: session.user.id,
        targetUserId: parsedBody.data.targetUserId,
      });
      return NextResponse.json({ result });
    }

    if (parsedBody.data.action === "accept_request") {
      await acceptFriendRequest({
        userId: session.user.id,
        friendshipId: parsedBody.data.friendshipId,
      });
      return NextResponse.json({ ok: true });
    }

    if (parsedBody.data.action === "decline_request") {
      await declineFriendRequest({
        userId: session.user.id,
        friendshipId: parsedBody.data.friendshipId,
      });
      return NextResponse.json({ ok: true });
    }

    if (parsedBody.data.action === "block_user") {
      await blockUser({
        userId: session.user.id,
        targetUserId: parsedBody.data.targetUserId,
      });
      return NextResponse.json({ ok: true });
    }

    await unblockUser({
      userId: session.user.id,
      targetUserId: parsedBody.data.targetUserId,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to perform this action.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
