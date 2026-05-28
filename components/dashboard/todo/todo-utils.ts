import type { TodoTask, TodoTaskApiRecord, TodoTaskFormValues, TodoTaskGroup, TodoTaskRow } from "./todo-types";
import { DEFAULT_DAILY_COLOR, DEFAULT_DAILY_ICON } from "@/lib/daily/presets";

function pad(value: number) {
  return String(value).padStart(2, "0");
}

export function formatLocalDateKey(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function formatLocalTimeKey(date: Date) {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function startOfLocalDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function addDays(date: Date, dayCount: number) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + dayCount);
}

export function isSameLocalDate(left: Date, right: Date) {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

export function createDeadline(dateKey: string, timeKey: string) {
  const [year, month, day] = (dateKey || formatLocalDateKey(new Date())).split("-").map(Number);
  const [hour, minute] = (timeKey || "23:59").split(":").map(Number);

  return new Date(year, month - 1, day, Number.isNaN(hour) ? 23 : hour, Number.isNaN(minute) ? 59 : minute, 0, 0);
}

export function formatDateInputValue(date: Date) {
  return formatLocalDateKey(date);
}

export function formatTimeInputValue(date: Date) {
  return formatLocalTimeKey(date);
}

export function buildDefaultTodoTaskFormValues(): TodoTaskFormValues {
  return {
    title: "",
    notes: "",
    parentId: null,
    color: DEFAULT_DAILY_COLOR,
    iconName: DEFAULT_DAILY_ICON,
    deadlineDate: formatLocalDateKey(new Date()),
    deadlineTime: "",
  };
}

export function buildTodoTaskFormValues(task: TodoTask | null): TodoTaskFormValues {
  if (!task) {
    return buildDefaultTodoTaskFormValues();
  }

  return {
    title: task.title,
    notes: task.notes,
    parentId: task.parentId,
    color: task.color || DEFAULT_DAILY_COLOR,
    iconName: task.iconName || DEFAULT_DAILY_ICON,
    deadlineDate: formatDateInputValue(task.deadline),
    deadlineTime: formatTimeInputValue(task.deadline),
  };
}

export function parseTodoTaskRecord(record: TodoTaskApiRecord): TodoTask {
  return {
    id: record.id,
    title: record.title,
    notes: record.notes ?? "",
    parentId: record.parentId,
    color: record.color,
    iconName: record.iconName,
    deadline: new Date(record.deadline),
    isFinished: record.isFinished,
    updatedAt: new Date(record.updatedAt),
    sortOrder: record.sortOrder,
  };
}

export function compareTodoTasks(left: TodoTask, right: TodoTask) {
  const deadlineDelta = left.deadline.getTime() - right.deadline.getTime();
  if (deadlineDelta !== 0) return deadlineDelta;

  const sortDelta = left.sortOrder - right.sortOrder;
  if (sortDelta !== 0) return sortDelta;

  return left.title.localeCompare(right.title);
}

export function buildTodoTaskRows(tasks: TodoTask[]) {
  const taskMap = new Map(tasks.map((task) => [task.id, task] as const));
  const childMap = new Map<string | null, TodoTask[]>();

  for (const task of tasks) {
    const bucket = childMap.get(task.parentId) ?? [];
    bucket.push(task);
    childMap.set(task.parentId, bucket);
  }

  const rows: TodoTaskRow[] = [];
  const walk = (parentId: string | null, depth: number) => {
    const children = [...(childMap.get(parentId) ?? [])].sort(compareTodoTasks);

    for (const task of children) {
      rows.push({ task, depth });
      walk(task.id, depth + 1);
    }
  };

  const roots = tasks.filter((task) => task.parentId === null || !taskMap.has(task.parentId));
  for (const root of roots.sort(compareTodoTasks)) {
    if (rows.some((row) => row.task.id === root.id)) continue;
    rows.push({ task: root, depth: 0 });
    walk(root.id, 1);
  }

  return rows;
}

export function collectTodoTaskDescendantIds(tasks: TodoTask[], rootId: string) {
  const childMap = new Map<string | null, string[]>();

  for (const task of tasks) {
    const bucket = childMap.get(task.parentId) ?? [];
    bucket.push(task.id);
    childMap.set(task.parentId, bucket);
  }

  const ids = new Set<string>();
  const stack = [...(childMap.get(rootId) ?? [])];

  while (stack.length > 0) {
    const currentId = stack.pop();
    if (!currentId || ids.has(currentId)) continue;

    ids.add(currentId);
    stack.push(...(childMap.get(currentId) ?? []));
  }

  return ids;
}

export function groupTodoTasksByDeadline(tasks: TodoTask[]): TodoTaskGroup {
  const now = new Date();
  const today = startOfLocalDay(now);
  const tomorrow = addDays(today, 1);
  const dayAfterTomorrow = addDays(today, 2);

  const activeTasks = tasks.filter((task) => !task.isFinished);
  const passedTime = activeTasks.filter((task) => task.deadline < now).sort(compareTodoTasks);
  const todayTasks = activeTasks.filter((task) => isSameLocalDate(task.deadline, today) && task.deadline >= now).sort(compareTodoTasks);
  const tomorrowTasks = activeTasks.filter((task) => isSameLocalDate(task.deadline, tomorrow)).sort(compareTodoTasks);
  const upcomingTasks = activeTasks.filter((task) => task.deadline >= dayAfterTomorrow).sort(compareTodoTasks);
  const completedTasks = [...tasks.filter((task) => task.isFinished)].sort((left, right) => {
    const leftTime = left.updatedAt.getTime();
    const rightTime = right.updatedAt.getTime();
    return rightTime - leftTime;
  });

  return {
    passedTime,
    todayTasks,
    tomorrowTasks,
    upcomingTasks,
    completedTasks,
  };
}

export function formatDeadlineLabel(date: Date, locale: "en" | "ja" | "zh-CN") {
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}
