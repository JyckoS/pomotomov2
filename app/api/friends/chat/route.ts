import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { ensureDirectConversation } from "@/lib/data-access/conversation";

const chatSchema = z.object({
  friendUserId: z.string().min(1),
});

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

  const parsedBody = chatSchema.safeParse(body);
  if (!parsedBody.success) {
    return NextResponse.json(
      {
        error: "Invalid chat payload.",
        details: parsedBody.error.flatten(),
      },
      { status: 400 },
    );
  }

  try {
    const conversationId = await ensureDirectConversation({
      userId: session.user.id,
      friendUserId: parsedBody.data.friendUserId,
    });

    return NextResponse.json({ conversationId });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to start conversation.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
