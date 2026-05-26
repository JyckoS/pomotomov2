"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CheckSquare, Clock3, PencilLine, Plus, Square } from "lucide-react";

import { Button } from "@/components/ui/button";
import { usePreferences } from "@/components/preferences/preferences-provider";
import { formatDailyTime, getLocalDateKey } from "@/lib/daily/date";
import { DAILY_ICON_PRESETS, DEFAULT_DAILY_COLOR, DEFAULT_DAILY_ICON } from "@/lib/daily/presets";
import { getDailyIconTone, getDailySwatchSurface } from "@/lib/daily/color";
import { cn } from "@/lib/utils";

import { DailyTaskDialog, type DailyTaskFormValues, type DailyTaskOption } from "./daily-task-dialog";

type DailyTaskView = DailyTaskFormValues & {
  id: string;
  userId: string;
  depth: number;
  isCompleted: boolean;
  sortOrder: number;
};

type DailyState = {
  tasks: DailyTaskView[];
  incompleteCount: number;
  totalCount: number;
};

function buildDefaultFormValues(): DailyTaskFormValues {
  return {
    title: "",
    notes: "",
    parentId: null,
    color: DEFAULT_DAILY_COLOR,
    iconName: DEFAULT_DAILY_ICON,
    toCompleteBefore: "",
  };
}

function toTaskFormValues(task: DailyTaskView | null): DailyTaskFormValues {
  if (!task) {
    return buildDefaultFormValues();
  }

  return {
    title: task.title,
    notes: task.notes ?? "",
    parentId: task.parentId,
    color: task.color || DEFAULT_DAILY_COLOR,
    iconName: task.iconName || DEFAULT_DAILY_ICON,
    toCompleteBefore: task.toCompleteBefore ?? "",
  };
}

function collectDescendantIds(tasks: DailyTaskView[], rootId: string) {
  const childMap = new Map<string | null, string[]>();

  for (const task of tasks) {
    const bucket = childMap.get(task.parentId) ?? [];
    bucket.push(task.id);
    childMap.set(task.parentId, bucket);
  }

  const ids = new Set<string>();
  const queue = [...(childMap.get(rootId) ?? [])];

  while (queue.length > 0) {
    const currentId = queue.pop();
    if (!currentId || ids.has(currentId)) continue;

    ids.add(currentId);
    queue.push(...(childMap.get(currentId) ?? []));
  }

  return ids;
}

async function fetchDailyState(day: string, fallbackErrorMessage: string) {
  const response = await fetch(`/api/daily?day=${day}`, { cache: "no-store" });

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(errorBody?.error ?? fallbackErrorMessage);
  }

  return (await response.json()) as DailyState & { day: string };
}

export function DailyBoard() {
  const { dictionary: dict, effectiveTheme } = usePreferences();
  const [dayKey, setDayKey] = useState(() => getLocalDateKey());
  const [state, setState] = useState<DailyState>({ tasks: [], incompleteCount: 0, totalCount: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<DailyTaskFormValues>(buildDefaultFormValues());

  const editingTask = useMemo(
    () => state.tasks.find((task) => task.id === editingTaskId) ?? null,
    [editingTaskId, state.tasks],
  );

  const parentOptions = useMemo(() => {
    if (!editingTask) {
      return state.tasks.map((task) => ({ id: task.id, title: task.title, depth: task.depth })) satisfies DailyTaskOption[];
    }

    const descendantIds = collectDescendantIds(state.tasks, editingTask.id);

    return state.tasks
      .filter((task) => task.id !== editingTask.id && !descendantIds.has(task.id))
      .map((task) => ({ id: task.id, title: task.title, depth: task.depth })) satisfies DailyTaskOption[];
  }, [editingTask, state.tasks]);

  const loadState = useCallback(async (nextDayKey: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const nextState = await fetchDailyState(nextDayKey, dict.dailySection.error);
      setState({
        tasks: nextState.tasks,
        incompleteCount: nextState.incompleteCount,
        totalCount: nextState.totalCount,
      });
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : dict.dailySection.error);
    } finally {
      setIsLoading(false);
    }
  }, [dict.dailySection.error]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadState(dayKey);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [dayKey, loadState]);

  useEffect(() => {
    const scheduleRefresh = () => {
      const now = new Date();
      const nextMidnight = new Date(now);
      nextMidnight.setHours(24, 0, 0, 0);

      return window.setTimeout(() => {
        const nextDay = getLocalDateKey();
        setDayKey(nextDay);
        void loadState(nextDay);
      }, nextMidnight.getTime() - now.getTime());
    };

    const timeoutId = scheduleRefresh();

    return () => window.clearTimeout(timeoutId);
  }, [dayKey, loadState]);

  const openCreateDialog = () => {
    setEditingTaskId(null);
    setFormValues(buildDefaultFormValues());
    setDialogOpen(true);
  };

  const openEditDialog = (task: DailyTaskView) => {
    setEditingTaskId(task.id);
    setFormValues(toTaskFormValues(task));
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingTaskId(null);
    setFormValues(buildDefaultFormValues());
  };

  const saveTask = async () => {
    setIsMutating(true);
    setError(null);

    const payload = {
      day: dayKey,
      title: formValues.title.trim(),
      parentId: formValues.parentId ?? null,
      notes: formValues.notes.trim() || null,
      color: formValues.color || DEFAULT_DAILY_COLOR,
      iconName: formValues.iconName || DEFAULT_DAILY_ICON,
      toCompleteBefore: formValues.toCompleteBefore || null,
    };

    const response = await fetch(editingTaskId ? `/api/daily/${editingTaskId}` : "/api/daily", {
      method: editingTaskId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(() => null);

    if (!response || !response.ok) {
      const errorBody = (await response?.json().catch(() => null)) as { error?: string } | null;
      setError(errorBody?.error ?? dict.dailySection.error);
      setIsMutating(false);
      return;
    }

    await loadState(dayKey);
    setIsMutating(false);
    closeDialog();
  };

  const deleteTask = async () => {
    if (!editingTaskId) return;

    setIsMutating(true);
    setError(null);

    const response = await fetch(`/api/daily/${editingTaskId}`, {
      method: "DELETE",
    }).catch(() => null);

    if (!response || !response.ok) {
      const errorBody = (await response?.json().catch(() => null)) as { error?: string } | null;
      setError(errorBody?.error ?? dict.dailySection.error);
      setIsMutating(false);
      return;
    }

    await loadState(dayKey);
    setIsMutating(false);
    closeDialog();
  };

  const toggleCompletion = async (taskId: string) => {
    setIsMutating(true);
    setError(null);

    const response = await fetch(`/api/daily/${taskId}/complete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ day: dayKey }),
    }).catch(() => null);

    if (!response || !response.ok) {
      const errorBody = (await response?.json().catch(() => null)) as { error?: string } | null;
      setError(errorBody?.error ?? dict.dailySection.error);
      setIsMutating(false);
      return;
    }

    await loadState(dayKey);
    setIsMutating(false);
  };

  const completedCount = state.totalCount - state.incompleteCount;

  return (
    <div className="space-y-6">
      <section className="rounded-[16px] border border-[rgba(0,0,0,0.1)] bg-white p-5 shadow-[rgba(0,0,0,0.04)_0px_4px_18px,rgba(0,0,0,0.027)_0px_2.025px_7.84688px,rgba(0,0,0,0.02)_0px_0.8px_2.925px,rgba(0,0,0,0.01)_0px_0.175px_1.04062px] dark:border-[rgba(255,255,255,0.14)] dark:bg-[#171614] sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <p className="text-[12px] font-semibold uppercase tracking-[0.125px] text-warm-gray-300 dark:text-warm-gray-300">
              {dict.common.daily}
            </p>
            <h1 className="text-[32px] font-bold leading-[1.04] tracking-[-1px] text-[rgba(0,0,0,0.95)] dark:text-[rgba(255,255,255,0.95)] sm:text-[40px]">
              {dict.dailySection.title}
            </h1>
            <p className="max-w-2xl text-[16px] leading-normal text-warm-gray-500 dark:text-warm-gray-300">
              {dict.dailySection.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-[9999px] border border-black/10 bg-badge-blue-bg px-3 py-1.5 text-[12px] font-semibold text-badge-blue-text dark:border-white/10 dark:bg-[#13263a] dark:text-[#97c8f5]">
              {dict.dailySection.incompleteCount}: {state.incompleteCount}
            </div>
            <div className="rounded-[9999px] border border-black/10 bg-warm-white px-3 py-1.5 text-[12px] font-semibold text-warm-gray-500 dark:border-white/10 dark:bg-warm-dark dark:text-warm-gray-300">
              {dict.dailySection.completedCount}: {completedCount}
            </div>
            <Button type="button" onClick={openCreateDialog} className="ml-auto lg:ml-0">
              <Plus className="size-4" />
              {dict.dailySection.addTask}
            </Button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-[12px] text-warm-gray-300 dark:text-warm-gray-300">
          <span className="inline-flex items-center gap-1 rounded-[9999px] border border-[rgba(0,0,0,0.1)] px-2.5 py-1 dark:border-[rgba(255,255,255,0.14)]">
            <Clock3 className="size-3.5" />
            {dict.dailySection.resetHint}
          </span>
          <span className="inline-flex items-center gap-1 rounded-[9999px] border border-[rgba(0,0,0,0.1)] px-2.5 py-1 dark:border-[rgba(255,255,255,0.14)]">
            {dict.dailySection.totalCount}: {state.totalCount}
          </span>
        </div>
      </section>

      {error ? (
        <div className="rounded-[12px] border border-notion-orange/20 bg-[#fff6ef] px-4 py-3 text-sm text-notion-orange dark:border-notion-orange/30 dark:bg-[#2b1a12]">
          {error}
        </div>
      ) : null}

      <section className="rounded-[16px] border border-[rgba(0,0,0,0.1)] bg-white p-3 shadow-[rgba(0,0,0,0.04)_0px_4px_18px,rgba(0,0,0,0.027)_0px_2.025px_7.84688px,rgba(0,0,0,0.02)_0px_0.8px_2.925px,rgba(0,0,0,0.01)_0px_0.175px_1.04062px] dark:border-[rgba(255,255,255,0.14)] dark:bg-[#171614] sm:p-4">
        {isLoading ? (
          <div className="space-y-3 p-2">
            <div className="h-12 animate-pulse rounded-[12px] bg-warm-white dark:bg-warm-dark" />
            <div className="h-12 animate-pulse rounded-[12px] bg-warm-white dark:bg-warm-dark" />
            <div className="h-12 animate-pulse rounded-[12px] bg-warm-white dark:bg-warm-dark" />
          </div>
        ) : state.tasks.length === 0 ? (
          <div className="flex flex-col items-start gap-4 rounded-[12px] border border-dashed border-black/10 bg-warm-white p-6 dark:border-white/10 dark:bg-warm-dark">
            <div className="max-w-xl space-y-2">
              <h2 className="text-[22px] font-bold tracking-[-0.25px] text-[rgba(0,0,0,0.95)] dark:text-[rgba(255,255,255,0.95)]">
                {dict.dailySection.emptyTitle}
              </h2>
              <p className="text-[16px] leading-normal text-warm-gray-500 dark:text-warm-gray-300">
                {dict.dailySection.emptyDescription}
              </p>
            </div>
            <Button type="button" onClick={openCreateDialog}>
              <Plus className="size-4" />
              {dict.dailySection.addTask}
            </Button>
          </div>
        ) : (
          <div className="space-y-1">
            {state.tasks.map((task) => {
              const IconPreset = DAILY_ICON_PRESETS.find((preset) => preset.name === task.iconName)?.icon ?? DAILY_ICON_PRESETS[0].icon;
              const iconTone = getDailyIconTone(task.color, effectiveTheme === "dark");
              const swatch = getDailySwatchSurface(task.color, effectiveTheme === "dark");

              return (
                <div
                  key={task.id}
                  className={cn(
                    "group flex items-start gap-3 rounded-[12px] border border-transparent px-3 py-3 transition-colors hover:border-black/10 hover:bg-warm-white dark:hover:border-white/10 dark:hover:bg-warm-dark",
                    task.isCompleted && "opacity-70",
                  )}
                  style={{ paddingLeft: 12 + task.depth * 20 }}
                >
                  <button
                    type="button"
                    onClick={() => void toggleCompletion(task.id)}
                    disabled={isMutating}
                    className={cn(
                      "mt-0.5 inline-flex size-7 items-center justify-center rounded-[8px] border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-badge-blue-text",
                      task.isCompleted
                        ? "border-badge-blue-text bg-badge-blue-bg text-badge-blue-text dark:bg-[#13263a] dark:text-[#97c8f5]"
                        : "border-black/10 bg-white text-warm-gray-500 dark:border-white/10 dark:bg-[#201f1d] dark:text-warm-gray-300",
                    )}
                    aria-pressed={task.isCompleted}
                    aria-label={task.isCompleted ? `${task.title} completed` : `${task.title} incomplete`}
                  >
                    {task.isCompleted ? <CheckSquare className="size-4" /> : <Square className="size-4" />}
                  </button>

                  <div
                    className="mt-0.5 flex size-7 items-center justify-center rounded-[8px] border border-[rgba(0,0,0,0.1)]"
                    style={{ backgroundColor: swatch, color: iconTone }}
                  >
                    <IconPreset className="size-4" />
                  </div>

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p
                        className={cn(
                          "truncate text-[16px] font-semibold text-[rgba(0,0,0,0.95)] dark:text-[rgba(255,255,255,0.95)]",
                          task.isCompleted && "line-through text-warm-gray-300 dark:text-[#8f8a84]",
                        )}
                      >
                        {task.title}
                      </p>
                      {task.toCompleteBefore ? (
                        <span className="inline-flex items-center gap-1 rounded-[9999px] border border-black/10 bg-white px-2 py-0.5 text-[11px] font-semibold text-warm-gray-500 dark:border-white/10 dark:bg-[#201f1d] dark:text-warm-gray-300">
                          <Clock3 className="size-3" />
                          {formatDailyTime(task.toCompleteBefore)}
                        </span>
                      ) : null}
                    </div>
                    {task.notes ? (
                      <p className={cn("text-[14px] leading-normal text-warm-gray-500 dark:text-warm-gray-300", task.isCompleted && "line-through")}>{task.notes}</p>
                    ) : null}
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => openEditDialog(task)}
                    className="mt-0.5 text-warm-gray-500 opacity-0 transition-opacity group-hover:opacity-100 dark:text-warm-gray-300"
                    aria-label={`Edit ${task.title}`}
                  >
                    <PencilLine className="size-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <DailyTaskDialog
        open={dialogOpen}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) {
            closeDialog();
            return;
          }

          setDialogOpen(true);
        }}
        mode={editingTask ? "edit" : "create"}
        values={formValues}
        parentOptions={parentOptions}
        onChange={setFormValues}
        onSubmit={saveTask}
        onDelete={editingTask ? deleteTask : undefined}
        isSaving={isMutating}
        isDeleting={isMutating}
      />
    </div>
  );
}
