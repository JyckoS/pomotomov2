import "server-only";

import { db } from "@/db";
import { userHeartbeat } from "@/db/schema";

export async function touchUserHeartbeat({
  userId,
  source,
}: {
  userId: string;
  source?: string;
}) {
  const now = new Date();

  const [heartbeat] = await db
    .insert(userHeartbeat)
    .values({
      userId,
      lastHeartbeatAt: now,
      source: source ?? null,
      createdAt: now,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: userHeartbeat.userId,
      set: {
        lastHeartbeatAt: now,
        source: source ?? null,
        updatedAt: now,
      },
    })
    .returning({
      userId: userHeartbeat.userId,
      lastHeartbeatAt: userHeartbeat.lastHeartbeatAt,
      source: userHeartbeat.source,
    });

  return heartbeat;
}
