"use client";

import { type FormEvent } from "react";
import { FileText } from "lucide-react";

import { DailyColorSwatch } from "@/components/dashboard/daily/daily-task-dialog/daily-color-swatch";
import { DailyIconSwatch } from "@/components/dashboard/daily/daily-task-dialog/daily-icon-swatch";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePreferences } from "@/components/preferences/preferences-provider";
import { getDailyIconTone, getDailySwatchSurface } from "@/lib/daily/color";
import { DAILY_COLOR_PRESETS, DAILY_ICON_PRESETS, DEFAULT_DAILY_COLOR, DEFAULT_DAILY_ICON } from "@/lib/daily/presets";

import type { TodoTask, TodoTaskFormValues } from "./todo-types";
import { createDeadline } from "./todo-utils";

export type TodoTaskDialogProps = {
  open: boolean;
  mode: "create" | "edit";
  values: TodoTaskFormValues;
  parentOptions: TodoTask[];
  onOpenChange: (open: boolean) => void;
  onChange: (nextValues: TodoTaskFormValues) => void;
  onSubmit: () => Promise<void>;
  onDelete: () => Promise<void>;
};

export function TodoTaskDialog({
  open,
  mode,
  values,
  parentOptions,
  onOpenChange,
  onChange,
  onSubmit,
  onDelete,
}: TodoTaskDialogProps) {
  const { dictionary: dict, effectiveTheme, effectiveLanguage } = usePreferences();
  const selectedColor = values.color || DEFAULT_DAILY_COLOR;
  const SelectedIcon = DAILY_ICON_PRESETS.find((preset) => preset.name === (values.iconName || DEFAULT_DAILY_ICON))?.icon ?? FileText;
  const previewDeadline = createDeadline(values.deadlineDate, values.deadlineTime || "23:59");
  const previewTone = getDailyIconTone(selectedColor, effectiveTheme === "dark");
  const previewSurface = getDailySwatchSurface(selectedColor, effectiveTheme === "dark");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100dvh-1rem)] overflow-hidden p-4 sm:max-w-[min(92vw,60rem)] sm:p-6">
        <form onSubmit={handleSubmit} className="max-h-[calc(100dvh-4.5rem)] space-y-4 overflow-y-auto pr-1 sm:space-y-5 sm:pr-2">
          <DialogHeader>
            <DialogTitle>{mode === "create" ? dict.todoSection.addTask : dict.todoSection.editTask}</DialogTitle>
            <DialogDescription>{dict.todoSection.subtitle}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="todo-task-title" className="text-[12px] font-semibold uppercase tracking-[0.125px] text-warm-gray-300 dark:text-[#9e9993]">
                  {dict.todoSection.taskTitle}
                </Label>
                <Input
                  id="todo-task-title"
                  value={values.title}
                  onChange={(event) => onChange({ ...values, title: event.target.value })}
                  placeholder={dict.todoSection.taskTitle}
                  autoFocus
                  maxLength={120}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="todo-task-notes" className="text-[12px] font-semibold uppercase tracking-[0.125px] text-warm-gray-300 dark:text-[#9e9993]">
                  {dict.todoSection.taskNotes}
                </Label>
                <textarea
                  id="todo-task-notes"
                  value={values.notes}
                  onChange={(event) => onChange({ ...values, notes: event.target.value })}
                  placeholder={dict.todoSection.taskNotesPlaceholder}
                  rows={3}
                  className="min-h-20 w-full rounded-[4px] border border-[rgba(0,0,0,0.1)] bg-white px-3 py-2 text-[16px] text-[rgba(0,0,0,0.9)] outline-none transition-all placeholder:text-warm-gray-300 focus-visible:border-badge-blue-text focus-visible:ring-2 focus-visible:ring-badge-blue-text/20 dark:border-[rgba(255,255,255,0.14)] dark:bg-[#201f1d] dark:text-[rgba(255,255,255,0.92)] dark:placeholder:text-[#8f8a84]"
                  maxLength={500}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[12px] font-semibold uppercase tracking-[0.125px] text-warm-gray-300 dark:text-[#9e9993]">
                  {dict.todoSection.parentTask}
                </Label>
                <div className="max-h-44 space-y-2 overflow-y-auto rounded-[8px] border border-[rgba(0,0,0,0.1)] p-2 dark:border-[rgba(255,255,255,0.14)]">
                  <button
                    type="button"
                    onClick={() => onChange({ ...values, parentId: null })}
                    className={`flex w-full items-center justify-between rounded-[8px] px-3 py-2 text-left text-sm transition-colors ${
                      values.parentId === null
                        ? "bg-warm-white text-[rgba(0,0,0,0.95)] dark:bg-[#252320] dark:text-[rgba(255,255,255,0.95)]"
                        : "text-warm-gray-500 hover:bg-warm-white dark:text-[#beb8b1] dark:hover:bg-[#23211f]"
                    }`}
                  >
                    <span>{dict.todoSection.noParent}</span>
                    <span className="text-[11px] text-warm-gray-300">{dict.todoSection.defaultIcon}</span>
                  </button>

                  {parentOptions.map((option) => {
                    const isSelected = values.parentId === option.id;

                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => onChange({ ...values, parentId: option.id })}
                        className={`flex w-full items-center gap-2 rounded-[8px] px-3 py-2 text-left text-sm transition-colors ${
                          isSelected
                            ? "bg-warm-white text-[rgba(0,0,0,0.95)] dark:bg-[#252320] dark:text-[rgba(255,255,255,0.95)]"
                            : "text-warm-gray-500 hover:bg-warm-white dark:text-[#beb8b1] dark:hover:bg-[#23211f]"
                        }`}
                      >
                        <span className="text-[11px] text-warm-gray-300 dark:text-[#9e9993]">•</span>
                        <span className="min-w-0 truncate">{option.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[12px] font-semibold uppercase tracking-[0.125px] text-warm-gray-300 dark:text-[#9e9993]">
                  {dict.todoSection.deadline}
                </Label>
                <div className="space-y-2 rounded-[10px] border border-[rgba(0,0,0,0.1)] p-2 dark:border-[rgba(255,255,255,0.14)]">
                  <div className="grid gap-2 sm:grid-cols-2">
                    <div className="space-y-1">
                      <Label htmlFor="todo-task-date" className="text-[11px] font-semibold uppercase tracking-[0.125px] text-warm-gray-300 dark:text-[#9e9993]">
                        {dict.todoSection.date}
                      </Label>
                      <Input
                        id="todo-task-date"
                        type="date"
                        value={values.deadlineDate}
                        onChange={(event) => onChange({ ...values, deadlineDate: event.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="todo-task-time" className="text-[11px] font-semibold uppercase tracking-[0.125px] text-warm-gray-300 dark:text-[#9e9993]">
                        {dict.todoSection.time}
                      </Label>
                      <Input
                        id="todo-task-time"
                        type="time"
                        value={values.deadlineTime}
                        onChange={(event) => onChange({ ...values, deadlineTime: event.target.value })}
                      />
                    </div>
                  </div>
                  <p className="text-[12px] text-warm-gray-300 dark:text-[#9e9993]">{dict.todoSection.deadlineHint}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-[12px] border border-[rgba(0,0,0,0.1)] bg-warm-white p-3 dark:border-[rgba(255,255,255,0.14)] dark:bg-[#23211f] sm:p-4">
                <div className="flex items-start gap-3">
                  <div
                    className="flex size-12 items-center justify-center rounded-[12px] border border-[rgba(0,0,0,0.08)]"
                    style={{ backgroundColor: previewSurface, color: previewTone }}
                  >
                    <SelectedIcon className="size-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.125px] text-warm-gray-300 dark:text-[#9e9993]">
                      {dict.todoSection.color} / {dict.todoSection.icon}
                    </p>
                    <p className="truncate text-[16px] font-semibold text-[rgba(0,0,0,0.95)] dark:text-[rgba(255,255,255,0.95)]">
                      {values.title.trim() || dict.todoSection.emptyTitle}
                    </p>
                    <p className="mt-1 text-[12px] text-warm-gray-300 dark:text-[#9e9993]">
                      {new Intl.DateTimeFormat(effectiveLanguage, { weekday: "short", month: "short", day: "numeric" }).format(previewDeadline)} · {new Intl.DateTimeFormat(effectiveLanguage, { hour: "numeric", minute: "2-digit" }).format(previewDeadline)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <Label className="text-[12px] font-semibold uppercase tracking-[0.125px] text-warm-gray-300 dark:text-[#9e9993]">
                    {dict.todoSection.colorPickerTitle}
                  </Label>
                  <span className="text-[12px] text-warm-gray-300 dark:text-[#9e9993]">
                    {values.color === DEFAULT_DAILY_COLOR ? dict.todoSection.defaultColor : values.color}
                  </span>
                </div>
                <div className="max-h-40 overflow-y-auto pr-1">
                  <div className="grid grid-cols-5 gap-2">
                    {DAILY_COLOR_PRESETS.map((preset) => (
                      <DailyColorSwatch
                        key={preset.value}
                        color={preset.value}
                        selected={values.color === preset.value}
                        isDarkMode={effectiveTheme === "dark"}
                        onSelect={() => onChange({ ...values, color: preset.value })}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <Label className="text-[12px] font-semibold uppercase tracking-[0.125px] text-warm-gray-300 dark:text-[#9e9993]">
                    {dict.todoSection.iconPickerTitle}
                  </Label>
                  <span className="text-[12px] text-warm-gray-300 dark:text-[#9e9993]">
                    {values.iconName === DEFAULT_DAILY_ICON ? dict.todoSection.defaultIcon : values.iconName}
                  </span>
                </div>
                <div className="max-h-40 overflow-y-auto pr-1">
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {DAILY_ICON_PRESETS.map((preset) => (
                      <DailyIconSwatch
                        key={preset.name}
                        iconName={preset.name}
                        selected={values.iconName === preset.name}
                        color={values.color}
                        label={preset.name}
                        isDarkMode={effectiveTheme === "dark"}
                        onSelect={() => onChange({ ...values, iconName: preset.name })}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="items-center justify-between gap-3 sm:flex-row">
            <div className="text-[12px] text-warm-gray-300 dark:text-[#9e9993]">{dict.todoSection.deadlineHint}</div>
            <div className="flex items-center gap-2">
              {mode === "edit" ? (
                <Button type="button" variant="destructive" onClick={() => void onDelete()}>
                  {dict.todoSection.deleteTask}
                </Button>
              ) : null}
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                {dict.common.cancel}
              </Button>
              <Button type="submit">{dict.common.save}</Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
