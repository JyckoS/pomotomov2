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
