import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { getConversationDetails, sendConversationMessage } from "@/lib/data-access/conversation";

const sendMessageSchema = z.object({
  conversationId: z.string().uuid(),
  content: z.string().trim().min(1).max(2000),
});

export async function GET(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const url = new URL(request.url);
  const conversationId = url.searchParams.get("conversationId");
  const before = url.searchParams.get("before");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "30");

  if (!conversationId) {
    return NextResponse.json({ error: "conversationId is required." }, { status: 400 });
  }

  try {
    const data = await getConversationDetails({
      conversationId,
      userId: session.user.id,
      pageSize: Number.isFinite(pageSize) ? pageSize : 30,
      before: before ? new Date(before) : null,
    });
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load conversation.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

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

  const parsedBody = sendMessageSchema.safeParse(body);
  if (!parsedBody.success) {
    return NextResponse.json(
      {
        error: "Invalid message payload.",
        details: parsedBody.error.flatten(),
      },
      { status: 400 },
    );
  }

  try {
    const message = await sendConversationMessage({
      conversationId: parsedBody.data.conversationId,
      userId: session.user.id,
      content: parsedBody.data.content,
    });
    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to send message.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
