import "server-only";

import { and, asc, eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { todoTask } from "@/db/schema";

export type TodoTaskRecord = {
  id: string;
  userId: string;
  parentId: string | null;
  title: string;
  notes: string | null;
  color: string;
  iconName: string;
  deadline: Date;
  isFinished: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
};

const todoTaskSelection = {
  id: todoTask.id,
  userId: todoTask.userId,
  parentId: todoTask.parentId,
  title: todoTask.title,
  notes: todoTask.notes,
  color: todoTask.color,
  iconName: todoTask.iconName,
  deadline: todoTask.deadline,
  isFinished: todoTask.isFinished,
  sortOrder: todoTask.sortOrder,
  createdAt: todoTask.createdAt,
  updatedAt: todoTask.updatedAt,
};

async function getNextSortOrder({ userId, parentId }: { userId: string; parentId: string | null }) {
  const result = await db
    .select({ maxSortOrder: sql<number>`coalesce(max(${todoTask.sortOrder}), -1)` })
    .from(todoTask)
    .where(and(eq(todoTask.userId, userId), parentId === null ? sql`true` : eq(todoTask.parentId, parentId)));

  return (result[0]?.maxSortOrder ?? -1) + 1;
}

export async function getTodoTasksForUser({ userId }: { userId: string }) {
  const rows = await db
    .select(todoTaskSelection)
    .from(todoTask)
    .where(eq(todoTask.userId, userId))
    .orderBy(asc(todoTask.parentId), asc(todoTask.sortOrder), asc(todoTask.createdAt));

  return rows as TodoTaskRecord[];
}

export async function getTodoTaskById({ userId, taskId }: { userId: string; taskId: string }) {
  const [task] = await db
    .select(todoTaskSelection)
    .from(todoTask)
    .where(and(eq(todoTask.userId, userId), eq(todoTask.id, taskId)))
    .limit(1);

  return (task as TodoTaskRecord | undefined) ?? null;
}

export async function createTodoTask({
  userId,
  parentId,
  title,
  notes,
  color,
  iconName,
  deadline,
  isFinished = false,
}: {
  userId: string;
  parentId: string | null;
  title: string;
  notes?: string | null;
  color: string;
  iconName: string;
  deadline: Date;
  isFinished?: boolean;
}) {
  const sortOrder = await getNextSortOrder({ userId, parentId });

  const [createdTask] = await db
    .insert(todoTask)
    .values({
      userId,
      parentId,
      title,
      notes: notes?.trim() ? notes.trim() : null,
      color,
      iconName,
      deadline,
      isFinished,
      sortOrder,
    })
    .returning(todoTaskSelection);

  return createdTask as TodoTaskRecord;
}

export async function updateTodoTask({
  userId,
  taskId,
  parentId,
  title,
  notes,
  color,
  iconName,
  deadline,
  isFinished,
}: {
  userId: string;
  taskId: string;
  parentId: string | null;
  title: string;
  notes?: string | null;
  color: string;
  iconName: string;
  deadline: Date;
  isFinished: boolean;
}) {
  const [updatedTask] = await db
    .update(todoTask)
    .set({
      parentId,
      title,
      notes: notes?.trim() ? notes.trim() : null,
      color,
      iconName,
      deadline,
      isFinished,
      updatedAt: new Date(),
    })
    .where(and(eq(todoTask.userId, userId), eq(todoTask.id, taskId)))
    .returning(todoTaskSelection);

  return updatedTask as TodoTaskRecord | undefined;
}

export async function deleteTodoTask({ userId, taskId }: { userId: string; taskId: string }) {
  await db.delete(todoTask).where(and(eq(todoTask.userId, userId), eq(todoTask.id, taskId)));
}
