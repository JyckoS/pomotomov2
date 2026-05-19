import "server-only";

import { db } from "@/db";
import { pomodoroRecord } from "@/db/schema";

const pomodoroRecordSelection = {
  id: pomodoroRecord.id,
  userId: pomodoroRecord.userId,
  seconds: pomodoroRecord.seconds,
  createdAt: pomodoroRecord.createdAt,
};

export async function createPomodoroRecord({
  userId,
  seconds,
}: {
  userId: string;
  seconds: number;
}) {
  const [record] = await db
    .insert(pomodoroRecord)
    .values({
      userId,
      seconds,
    })
    .returning(pomodoroRecordSelection);

  return record;
}
