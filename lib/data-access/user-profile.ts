import "server-only";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { user } from "@/db/schema";

export async function updateUserProfileImage({
  userId,
  imageUrl,
}: {
  userId: string;
  imageUrl: string;
}) {
  await db
    .update(user)
    .set({
      image: imageUrl,
      updatedAt: new Date(),
    })
    .where(eq(user.id, userId));
}

export async function updateUserStatus({
  userId,
  status,
}: {
  userId: string;
  status: string;
}) {
  await db
    .update(user)
    .set({
      status,
      updatedAt: new Date(),
    })
    .where(eq(user.id, userId));
}

export async function getUserStatus({ userId }: { userId: string }) {
  const [result] = await db
    .select({ status: user.status })
    .from(user)
    .where(eq(user.id, userId))
    .limit(1);

  return result?.status ?? null;
}
