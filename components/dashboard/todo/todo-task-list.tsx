"use client";

import type { ReactNode } from "react";
import { CheckSquare, ChevronDown, Clock3, FileText, PencilLine, Square } from "lucide-react";

import { Button } from "@/components/ui/button";
import { usePreferences } from "@/components/preferences/preferences-provider";
import { getDailyIconTone, getDailySwatchSurface } from "@/lib/daily/color";
import { DAILY_ICON_PRESETS } from "@/lib/daily/presets";
import { cn } from "@/lib/utils";

import type { TodoTask, TodoTaskGroup, TodoTaskRow } from "./todo-types";
import { buildTodoTaskRows, formatDeadlineLabel } from "./todo-utils";

function TodoTaskSection({
  title,
  count,
  defaultOpen,
  rows,
  renderTaskRows,
}: {
  title: string;
  count: number;
  defaultOpen?: boolean;
  rows: TodoTaskRow[];
  renderTaskRows: (rows: TodoTaskRow[]) => ReactNode;
}) {
  return (
    <details open={defaultOpen} className="group rounded-[14px] border border-[rgba(0,0,0,0.1)] bg-white shadow-[rgba(0,0,0,0.04)_0px_4px_18px,rgba(0,0,0,0.027)_0px_2.025px_7.84688px,rgba(0,0,0,0.02)_0px_0.8px_2.925px,rgba(0,0,0,0.01)_0px_0.175px_1.04062px] dark:border-[rgba(255,255,255,0.14)] dark:bg-[#171614]">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden">
        <div className="min-w-0">
          <p className="text-[15px] font-semibold text-[rgba(0,0,0,0.95)] dark:text-[rgba(255,255,255,0.95)]">{title}</p>
          <p className="text-[12px] text-warm-gray-300 dark:text-[#9e9993]">{count}</p>
        </div>
        <ChevronDown className="size-4 text-warm-gray-300 transition-transform duration-200 dark:text-[#9e9993]" />
      </summary>
      <div className="border-t border-[rgba(0,0,0,0.08)] p-3 dark:border-[rgba(255,255,255,0.08)]">
        {renderTaskRows(rows)}
      </div>
    </details>
  );
}

function TodoTaskRows({
  rows,
  effectiveTheme,
  effectiveLanguage,
  onToggleFinished,
  onEdit,
}: {
  rows: TodoTaskRow[];
  effectiveTheme: "light" | "dark";
  effectiveLanguage: "en" | "ja" | "zh-CN";
  onToggleFinished: (taskId: string) => void;
  onEdit: (task: TodoTask) => void;
}) {
  const { dictionary: dict } = usePreferences();

  if (rows.length === 0) {
    return (
      <div className="rounded-[12px] border border-dashed border-black/10 bg-warm-white px-4 py-5 text-sm text-warm-gray-500 dark:border-white/10 dark:bg-[#201f1d] dark:text-warm-gray-300">
        {dict.todoSection.emptyDescription}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {rows.map(({ task, depth }) => {
        const Icon = DAILY_ICON_PRESETS.find((preset) => preset.name === task.iconName)?.icon ?? FileText;
        const iconTone = getDailyIconTone(task.color, effectiveTheme === "dark");
        const swatch = getDailySwatchSurface(task.color, effectiveTheme === "dark");
        const deadlineLabel = formatDeadlineLabel(task.isFinished ? task.updatedAt : task.deadline, effectiveLanguage);

        return (
          <div
            key={task.id}
            className={cn(
              "group flex items-start gap-3 rounded-[12px] border border-transparent px-3 py-3 transition-colors hover:border-black/10 hover:bg-warm-white dark:hover:border-white/10 dark:hover:bg-[#201f1d]",
              task.isFinished && "opacity-70",
            )}
            style={{ paddingLeft: 12 + depth * 18 }}
          >
            <button
              type="button"
              onClick={() => onToggleFinished(task.id)}
              className={cn(
                "mt-0.5 inline-flex size-7 items-center justify-center rounded-[8px] border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-badge-blue-text",
                task.isFinished
                  ? "border-badge-blue-text bg-badge-blue-bg text-badge-blue-text dark:bg-[#13263a] dark:text-[#97c8f5]"
                  : "border-black/10 bg-white text-warm-gray-500 dark:border-white/10 dark:bg-[#252320] dark:text-warm-gray-300",
              )}
              aria-pressed={task.isFinished}
              aria-label={task.isFinished ? dict.todoSection.markUnfinished : dict.todoSection.markFinished}
            >
              {task.isFinished ? <CheckSquare className="size-4" /> : <Square className="size-4" />}
            </button>

            <div
              className="mt-0.5 flex size-7 items-center justify-center rounded-[8px] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.14)]"
              style={{ backgroundColor: swatch, color: iconTone }}
            >
              <Icon className="size-4" />
            </div>

            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <p
                  className={cn(
                    "truncate text-[16px] font-semibold text-[rgba(0,0,0,0.95)] dark:text-[rgba(255,255,255,0.95)]",
                    task.isFinished && "line-through text-warm-gray-300 dark:text-[#8f8a84]",
                  )}
                >
                  {task.title}
                </p>
                <span className="inline-flex items-center gap-1 rounded-[9999px] border border-black/10 bg-white px-2 py-0.5 text-[11px] font-semibold text-warm-gray-500 dark:border-white/10 dark:bg-[#252320] dark:text-warm-gray-300">
                  <Clock3 className="size-3" />
                  {deadlineLabel}
                </span>
              </div>
              {task.notes ? (
                <p className={cn("text-[14px] leading-normal text-warm-gray-500 dark:text-warm-gray-300", task.isFinished && "line-through")}>{task.notes}</p>
              ) : null}
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => onEdit(task)}
              className="mt-0.5 text-warm-gray-500 opacity-0 transition-opacity group-hover:opacity-100 dark:text-warm-gray-300"
              aria-label={`${dict.todoSection.editTask}: ${task.title}`}
            >
              <PencilLine className="size-4" />
            </Button>
          </div>
        );
      })}
    </div>
  );
}

export function TodoTaskList({
  effectiveTheme,
  effectiveLanguage,
  groups,
  onToggleFinished,
  onEdit,
}: {
  effectiveTheme: "light" | "dark";
  effectiveLanguage: "en" | "ja" | "zh-CN";
  groups: TodoTaskGroup;
  onToggleFinished: (taskId: string) => void;
  onEdit: (task: TodoTask) => void;
}) {
  const { dictionary: dict } = usePreferences();
  const renderRows = (nextRows: TodoTaskRow[]) => (
    <TodoTaskRows
      rows={nextRows}
      effectiveTheme={effectiveTheme}
      effectiveLanguage={effectiveLanguage}
      onToggleFinished={onToggleFinished}
      onEdit={onEdit}
    />
  );

  return (
    <div className="space-y-4">
      <TodoTaskSection title={dict.todoSection.passedTime} count={groups.passedTime.length} defaultOpen rows={buildTodoTaskRows(groups.passedTime)} renderTaskRows={renderRows} />
      <TodoTaskSection title={dict.todoSection.today} count={groups.todayTasks.length} defaultOpen rows={buildTodoTaskRows(groups.todayTasks)} renderTaskRows={renderRows} />
      <TodoTaskSection title={dict.todoSection.tomorrow} count={groups.tomorrowTasks.length} rows={buildTodoTaskRows(groups.tomorrowTasks)} renderTaskRows={renderRows} />
      <TodoTaskSection title={dict.todoSection.upcoming} count={groups.upcomingTasks.length} rows={buildTodoTaskRows(groups.upcomingTasks)} renderTaskRows={renderRows} />

      <section className="rounded-[14px] border border-[rgba(0,0,0,0.1)] bg-white shadow-[rgba(0,0,0,0.04)_0px_4px_18px,rgba(0,0,0,0.027)_0px_2.025px_7.84688px,rgba(0,0,0,0.02)_0px_0.8px_2.925px,rgba(0,0,0,0.01)_0px_0.175px_1.04062px] dark:border-[rgba(255,255,255,0.14)] dark:bg-[#171614]">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div>
            <p className="text-[15px] font-semibold text-[rgba(0,0,0,0.95)] dark:text-[rgba(255,255,255,0.95)]">{dict.todoSection.history}</p>
            <p className="text-[12px] text-warm-gray-300 dark:text-[#9e9993]">{groups.completedTasks.length}</p>
          </div>
        </div>
        <div className="border-t border-[rgba(0,0,0,0.08)] p-3 dark:border-[rgba(255,255,255,0.08)]">
          {groups.completedTasks.length === 0 ? (
            <div className="rounded-[12px] border border-dashed border-black/10 bg-warm-white px-4 py-5 text-sm text-warm-gray-500 dark:border-white/10 dark:bg-[#201f1d] dark:text-warm-gray-300">
              {dict.todoSection.historyEmptyDescription}
            </div>
          ) : (
            <TodoTaskRows
              rows={groups.completedTasks.map((task) => ({ task, depth: 0 }))}
              effectiveTheme={effectiveTheme}
              effectiveLanguage={effectiveLanguage}
              onToggleFinished={onToggleFinished}
              onEdit={onEdit}
            />
          )}
        </div>
      </section>
    </div>
  );
}
