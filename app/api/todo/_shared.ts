import { z } from "zod";

const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const timePattern = /^\d{2}:\d{2}$/;
const hexColorPattern = /^#[0-9a-fA-F]{6}$/;

export const todoTaskMutationSchema = z.object({
  title: z.string().trim().min(1).max(120),
  parentId: z.preprocess(
    (value) => (value === "" ? null : value),
    z.string().uuid().nullable().optional(),
  ),
  notes: z.preprocess(
    (value) => (value === "" ? null : value),
    z.string().trim().max(500).nullable().optional(),
  ),
  color: z.string().trim().regex(hexColorPattern),
  iconName: z.string().trim().min(1),
  deadlineDate: z.preprocess(
    (value) => (value === "" ? null : value),
    z.string().regex(datePattern).nullable().optional(),
  ),
  deadlineTime: z.preprocess(
    (value) => (value === "" ? null : value),
    z.string().regex(timePattern).nullable().optional(),
  ),
  isFinished: z.preprocess((value) => {
    if (value === "true") return true;
    if (value === "false") return false;
    return value;
  }, z.boolean().optional()),
});

export function buildTodoDeadline(dateKey?: string | null, timeKey?: string | null) {
  const today = new Date();
  const [year, month, day] = (dateKey ?? `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`).split("-").map(Number);
  const [hour, minute] = (timeKey ?? "23:59").split(":").map(Number);

  return new Date(year, month - 1, day, Number.isNaN(hour) ? 23 : hour, Number.isNaN(minute) ? 59 : minute, 0, 0);
}
