"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { usePreferences } from "@/components/preferences/preferences-provider";

import { TodoTaskDialog } from "./todo-task-dialog";
import { TodoTaskList } from "./todo-task-list";
import type { TodoTask, TodoTaskApiRecord, TodoTaskFormValues } from "./todo-types";
import {
  buildDefaultTodoTaskFormValues,
  buildTodoTaskFormValues,
  buildTodoTaskRows,
  collectTodoTaskDescendantIds,
  formatLocalDateKey,
  formatLocalTimeKey,
  groupTodoTasksByDeadline,
  parseTodoTaskRecord,
} from "./todo-utils";

async function fetchTodoTasks() {
  const response = await fetch("/api/todo", { cache: "no-store" });

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(errorBody?.error ?? "Unable to load todo tasks.");
  }

  const body = (await response.json()) as { tasks: TodoTaskApiRecord[] };
  return body.tasks.map(parseTodoTaskRecord);
}

export function TodoBoard() {
  const { dictionary: dict, effectiveTheme, effectiveLanguage } = usePreferences();
  const [tasks, setTasks] = useState<TodoTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<TodoTaskFormValues>(() => buildDefaultTodoTaskFormValues());

  const editingTask = useMemo(() => tasks.find((task) => task.id === editingTaskId) ?? null, [editingTaskId, tasks]);
  const groupedRows = useMemo(() => buildTodoTaskRows(tasks), [tasks]);
  const groups = useMemo(() => groupTodoTasksByDeadline(tasks), [tasks]);

  const parentOptions = useMemo(() => {
    if (!editingTaskId) {
      return groupedRows.map((row) => row.task);
    }

    const descendantIds = collectTodoTaskDescendantIds(tasks, editingTaskId);
    return groupedRows
      .filter((row) => row.task.id !== editingTaskId && !descendantIds.has(row.task.id))
      .map((row) => row.task);
  }, [editingTaskId, groupedRows, tasks]);

  const loadTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      setTasks(await fetchTodoTasks());
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load todo tasks.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadTasks();
  }, [loadTasks]);

  const openCreateDialog = () => {
    setEditingTaskId(null);
    setFormValues(buildDefaultTodoTaskFormValues());
    setDialogOpen(true);
  };

  const openEditDialog = (task: TodoTask) => {
    setEditingTaskId(task.id);
    setFormValues(buildTodoTaskFormValues(task));
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingTaskId(null);
    setFormValues(buildDefaultTodoTaskFormValues());
  };

  const saveTask = async () => {
    const title = formValues.title.trim();
    if (!title) return;

    const response = await fetch(editingTask ? `/api/todo/${editingTask.id}` : "/api/todo", {
      method: editingTask ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        parentId: formValues.parentId,
        notes: formValues.notes.trim() || null,
        color: formValues.color,
        iconName: formValues.iconName,
        deadlineDate: formValues.deadlineDate,
        deadlineTime: formValues.deadlineTime || null,
        isFinished: editingTask?.isFinished ?? false,
      }),
    }).catch(() => null);

    if (!response || !response.ok) {
      const errorBody = (await response?.json().catch(() => null)) as { error?: string } | null;
      setError(errorBody?.error ?? "Unable to save todo task.");
      return;
    }

    await loadTasks();
    closeDialog();
  };

  const deleteTask = async () => {
    if (!editingTask) return;

    const response = await fetch(`/api/todo/${editingTask.id}`, {
      method: "DELETE",
    }).catch(() => null);

    if (!response || !response.ok) {
      const errorBody = (await response?.json().catch(() => null)) as { error?: string } | null;
      setError(errorBody?.error ?? "Unable to delete todo task.");
      return;
    }

    await loadTasks();
    closeDialog();
  };

  const toggleFinished = async (taskId: string) => {
    const task = tasks.find((currentTask) => currentTask.id === taskId);
    if (!task) return;

    const response = await fetch(`/api/todo/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: task.title,
        parentId: task.parentId,
        notes: task.notes || null,
        color: task.color,
        iconName: task.iconName,
        deadlineDate: formatLocalDateKey(task.deadline),
        deadlineTime: formatLocalTimeKey(task.deadline),
        isFinished: !task.isFinished,
      }),
    }).catch(() => null);

    if (!response || !response.ok) {
      const errorBody = (await response?.json().catch(() => null)) as { error?: string } | null;
      setError(errorBody?.error ?? "Unable to update todo task.");
      return;
    }

    await loadTasks();
  };

  return (
    <div className="space-y-6 pb-6">
      <section className="rounded-[16px] border border-[rgba(0,0,0,0.1)] bg-white p-5 shadow-[rgba(0,0,0,0.04)_0px_4px_18px,rgba(0,0,0,0.027)_0px_2.025px_7.84688px,rgba(0,0,0,0.02)_0px_0.8px_2.925px,rgba(0,0,0,0.01)_0px_0.175px_1.04062px] dark:border-[rgba(255,255,255,0.14)] dark:bg-[#171614] sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <p className="text-[12px] font-semibold uppercase tracking-[0.125px] text-warm-gray-300 dark:text-[#9e9993]">{dict.common.todo}</p>
            <h1 className="text-[32px] font-bold leading-[1.04] tracking-[-1px] text-[rgba(0,0,0,0.95)] dark:text-[rgba(255,255,255,0.95)] sm:text-[40px]">{dict.todoSection.title}</h1>
            <p className="max-w-2xl text-[16px] leading-normal text-warm-gray-500 dark:text-warm-gray-300">{dict.todoSection.subtitle}</p>
          </div>

          <div className="flex items-center gap-3">
            <Button type="button" onClick={openCreateDialog} className="ml-auto lg:ml-0">
              <Plus className="size-4" />
              {dict.todoSection.addTask}
            </Button>
          </div>
        </div>
      </section>

      {isLoading ? (
        <div className="rounded-[14px] border border-[rgba(0,0,0,0.1)] bg-white p-4 text-sm text-warm-gray-500 shadow-[rgba(0,0,0,0.04)_0px_4px_18px,rgba(0,0,0,0.027)_0px_2.025px_7.84688px,rgba(0,0,0,0.02)_0px_0.8px_2.925px,rgba(0,0,0,0.01)_0px_0.175px_1.04062px] dark:border-[rgba(255,255,255,0.14)] dark:bg-[#171614] dark:text-warm-gray-300">
          Loading todo tasks...
        </div>
      ) : null}

      {error ? (
        <div className="rounded-[12px] border border-notion-orange/20 bg-[#fff6ef] px-4 py-3 text-sm text-notion-orange dark:border-notion-orange/30 dark:bg-[#2b1a12]">
          {error}
        </div>
      ) : null}

      <TodoTaskList
        groups={groups}
        effectiveTheme={effectiveTheme}
        effectiveLanguage={effectiveLanguage}
        onToggleFinished={toggleFinished}
        onEdit={openEditDialog}
      />

      <TodoTaskDialog
        open={dialogOpen}
        mode={editingTask ? "edit" : "create"}
        values={formValues}
        parentOptions={parentOptions}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) {
            closeDialog();
            return;
          }

          setDialogOpen(true);
        }}
        onChange={setFormValues}
        onSubmit={saveTask}
        onDelete={deleteTask}
      />
    </div>
  );
}
