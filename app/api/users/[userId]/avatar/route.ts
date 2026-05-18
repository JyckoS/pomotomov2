import { get } from "@vercel/blob";
import { and, eq, isNull, or } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { friendship, user } from "@/db/schema";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  context: { params: Promise<{ userId: string }> | { userId: string } },
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { userId } = await Promise.resolve(context.params);
  if (!userId) {
    return NextResponse.json({ error: "Invalid user." }, { status: 400 });
  }

  const isSelf = session.user.id === userId;
  if (!isSelf) {
    const relation = await db
      .select({
        id: friendship.id,
      })
      .from(friendship)
      .where(
        and(
          eq(friendship.status, "accepted"),
          isNull(friendship.blockedByUserId),
          or(
            and(eq(friendship.requesterId, session.user.id), eq(friendship.receiverId, userId)),
            and(eq(friendship.requesterId, userId), eq(friendship.receiverId, session.user.id)),
          ),
        ),
      )
      .limit(1);

    if (!relation[0]) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }
  }

  const targetUser = await db
    .select({
      image: user.image,
    })
    .from(user)
    .where(eq(user.id, userId))
    .limit(1);

  const storedReference = targetUser[0]?.image;
  if (!storedReference) {
    return NextResponse.json({ error: "Avatar not found." }, { status: 404 });
  }

  if (storedReference.startsWith("http://") || storedReference.startsWith("https://")) {
    return NextResponse.redirect(storedReference);
  }

  const blobResult = await get(storedReference, {
    access: "private",
  });

  if (!blobResult || blobResult.statusCode !== 200) {
    return NextResponse.json({ error: "Avatar not found." }, { status: 404 });
  }

  return new NextResponse(blobResult.stream, {
    headers: {
      "Content-Type": blobResult.blob.contentType,
      "Cache-Control": "private, no-store",
    },
  });
}
