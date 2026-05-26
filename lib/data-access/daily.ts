import "server-only";

import { and, asc, eq, inArray, sql } from "drizzle-orm";

import { db } from "@/db";
import { dailyTaskCompletion, dailyTaskItem } from "@/db/schema";

export type DailyTaskRecord = {
  id: string;
  userId: string;
  parentId: string | null;
  title: string;
  notes: string | null;
  color: string;
  iconName: string;
  toCompleteBefore: string | null;
  sortOrder: number;
  isCompleted: boolean;
};

const dailyTaskSelection = {
  id: dailyTaskItem.id,
  userId: dailyTaskItem.userId,
  parentId: dailyTaskItem.parentId,
  title: dailyTaskItem.title,
  notes: dailyTaskItem.notes,
  color: dailyTaskItem.color,
  iconName: dailyTaskItem.iconName,
  toCompleteBefore: dailyTaskItem.toCompleteBefore,
  sortOrder: dailyTaskItem.sortOrder,
  isCompleted: sql<boolean>`coalesce(${dailyTaskCompletion.id} is not null, false)`,
};

function buildDailyTaskTree(records: DailyTaskRecord[]) {
  const byParent = new Map<string | null, DailyTaskRecord[]>();

  for (const record of records) {
    const bucket = byParent.get(record.parentId) ?? [];
    bucket.push(record);
    byParent.set(record.parentId, bucket);
  }

  for (const bucket of byParent.values()) {
    bucket.sort((left, right) => left.sortOrder - right.sortOrder || left.title.localeCompare(right.title));
  }

  const flatten = (parentId: string | null, depth: number, output: Array<DailyTaskRecord & { depth: number }>) => {
    const children = byParent.get(parentId) ?? [];

    for (const child of children) {
      output.push({ ...child, depth });
      flatten(child.id, depth + 1, output);
    }

    return output;
  };

  return flatten(null, 0, []);
}

async function getNextSortOrder({ userId, parentId }: { userId: string; parentId: string | null }) {
  const result = await db
    .select({ maxSortOrder: sql<number>`coalesce(max(${dailyTaskItem.sortOrder}), -1)` })
    .from(dailyTaskItem)
    .where(and(eq(dailyTaskItem.userId, userId), parentId === null ? sql`true` : eq(dailyTaskItem.parentId, parentId)));

  return (result[0]?.maxSortOrder ?? -1) + 1;
}

export async function getDailyTasksForUser({ userId, day }: { userId: string; day: string }) {
  const rows = await db
    .select(dailyTaskSelection)
    .from(dailyTaskItem)
    .leftJoin(
      dailyTaskCompletion,
      and(
        eq(dailyTaskCompletion.dailyTaskId, dailyTaskItem.id),
        eq(dailyTaskCompletion.userId, userId),
        eq(dailyTaskCompletion.day, day),
      ),
    )
    .where(eq(dailyTaskItem.userId, userId))
    .orderBy(asc(dailyTaskItem.parentId), asc(dailyTaskItem.sortOrder), asc(dailyTaskItem.createdAt));

  const tasks = rows.map((row) => row as DailyTaskRecord);
  const orderedTasks = buildDailyTaskTree(tasks);
  const incompleteCount = orderedTasks.filter((task) => !task.isCompleted).length;

  return {
    day,
    tasks: orderedTasks,
    incompleteCount,
    totalCount: orderedTasks.length,
  };
}

export async function getDailyTaskById({ userId, taskId }: { userId: string; taskId: string }) {
  const [task] = await db
    .select(dailyTaskSelection)
    .from(dailyTaskItem)
    .leftJoin(dailyTaskCompletion, and(eq(dailyTaskCompletion.dailyTaskId, dailyTaskItem.id), eq(dailyTaskCompletion.userId, userId)))
    .where(and(eq(dailyTaskItem.userId, userId), eq(dailyTaskItem.id, taskId)))
    .limit(1);

  return (task as DailyTaskRecord | undefined) ?? null;
}

export async function createDailyTask({
  userId,
  parentId,
  title,
  notes,
  color,
  iconName,
  toCompleteBefore,
}: {
  userId: string;
  parentId: string | null;
  title: string;
  notes?: string | null;
  color: string;
  iconName: string;
  toCompleteBefore?: string | null;
}) {
  const sortOrder = await getNextSortOrder({ userId, parentId });

  const [createdTask] = await db
    .insert(dailyTaskItem)
    .values({
      userId,
      parentId,
      title,
      notes: notes?.trim() ? notes.trim() : null,
      color,
      iconName,
      toCompleteBefore: toCompleteBefore ?? null,
      sortOrder,
    })
    .returning(dailyTaskSelection);

  return createdTask as DailyTaskRecord;
}

export async function updateDailyTask({
  userId,
  taskId,
  parentId,
  title,
  notes,
  color,
  iconName,
  toCompleteBefore,
}: {
  userId: string;
  taskId: string;
  parentId: string | null;
  title: string;
  notes?: string | null;
  color: string;
  iconName: string;
  toCompleteBefore?: string | null;
}) {
  const [updatedTask] = await db
    .update(dailyTaskItem)
    .set({
      parentId,
      title,
      notes: notes?.trim() ? notes.trim() : null,
      color,
      iconName,
      toCompleteBefore: toCompleteBefore ?? null,
      updatedAt: new Date(),
    })
    .where(and(eq(dailyTaskItem.userId, userId), eq(dailyTaskItem.id, taskId)))
    .returning(dailyTaskSelection);

  return updatedTask as DailyTaskRecord;
}

export async function deleteDailyTask({ userId, taskId }: { userId: string; taskId: string }) {
  const tasks = await db
    .select({ id: dailyTaskItem.id, parentId: dailyTaskItem.parentId })
    .from(dailyTaskItem)
    .where(eq(dailyTaskItem.userId, userId));

  const childMap = new Map<string | null, string[]>();

  for (const task of tasks) {
    const bucket = childMap.get(task.parentId) ?? [];
    bucket.push(task.id);
    childMap.set(task.parentId, bucket);
  }

  const idsToDelete = new Set<string>();
  const queue = [taskId];

  while (queue.length > 0) {
    const currentId = queue.pop();
    if (!currentId || idsToDelete.has(currentId)) continue;

    idsToDelete.add(currentId);
    const children = childMap.get(currentId) ?? [];
    queue.push(...children);
  }

  if (idsToDelete.size === 0) {
    return;
  }

  await db.delete(dailyTaskCompletion).where(and(eq(dailyTaskCompletion.userId, userId), inArray(dailyTaskCompletion.dailyTaskId, [...idsToDelete])));
  await db.delete(dailyTaskItem).where(and(eq(dailyTaskItem.userId, userId), inArray(dailyTaskItem.id, [...idsToDelete])));
}

export async function toggleDailyTaskCompletion({ userId, taskId, day }: { userId: string; taskId: string; day: string }) {
  const [existingCompletion] = await db
    .select({ id: dailyTaskCompletion.id })
    .from(dailyTaskCompletion)
    .where(and(eq(dailyTaskCompletion.userId, userId), eq(dailyTaskCompletion.dailyTaskId, taskId), eq(dailyTaskCompletion.day, day)))
    .limit(1);

  if (existingCompletion) {
    await db.delete(dailyTaskCompletion).where(eq(dailyTaskCompletion.id, existingCompletion.id));
    return { isCompleted: false };
  }

  await db.insert(dailyTaskCompletion).values({
    userId,
    dailyTaskId: taskId,
    day,
  });

  return { isCompleted: true };
}

export async function getDailyIncompleteCount({ userId, day }: { userId: string; day: string }) {
  const result = await getDailyTasksForUser({ userId, day });
  return result.incompleteCount;
}
