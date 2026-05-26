"use client";

import { useState } from "react";
import { Clock3, FileText } from "lucide-react";

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
import { cn } from "@/lib/utils";
import {
  COLOR_PICKER_SCROLL_CLASS,
  DAILY_ICON_LABEL_FALLBACKS,
  ICON_PICKER_SCROLL_CLASS,
  PARENT_OPTIONS_PANEL_CLASS,
  TIME_HOUR_VALUES,
  TIME_MINUTE_VALUES,
  TIME_PICKER_PANEL_CLASS,
  formatClockValue,
  parseClockValue,
} from "./daily-task-dialog/constants";
import { DailyColorSwatch } from "./daily-task-dialog/daily-color-swatch";
import { DailyIconSwatch } from "./daily-task-dialog/daily-icon-swatch";
import { TimeWheelColumn } from "./daily-task-dialog/time-wheel-column";

export type DailyTaskFormValues = {
  title: string;
  notes: string;
  parentId: string | null;
  color: string;
  iconName: string;
  toCompleteBefore: string;
};

export type DailyTaskOption = {
  id: string;
  title: string;
  depth: number;
};

type DailyTaskDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  values: DailyTaskFormValues;
  parentOptions: DailyTaskOption[];
  onChange: (nextValues: DailyTaskFormValues) => void;
  onSubmit: () => Promise<void>;
  onDelete?: () => Promise<void>;
  isSaving: boolean;
  isDeleting?: boolean;
};

export function DailyTaskDialog({
  open,
  onOpenChange,
  mode,
  values,
  parentOptions,
  onChange,
  onSubmit,
  onDelete,
  isSaving,
  isDeleting,
}: DailyTaskDialogProps) {
  const { dictionary: dict, effectiveTheme } = usePreferences();
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const isDarkMode = effectiveTheme === "dark";

  const selectedColor = values.color || DEFAULT_DAILY_COLOR;
  const selectedIconName = values.iconName || DEFAULT_DAILY_ICON;
  const { hour: selectedHour, minute: selectedMinute } = parseClockValue(values.toCompleteBefore);
  const selectedIcon = DAILY_ICON_PRESETS.find((preset) => preset.name === selectedIconName) ?? DAILY_ICON_PRESETS[0];
  const SelectedIcon = selectedIcon?.icon ?? FileText;
  const taskTitle = values.title.trim();
  const selectedIconIndex = DAILY_ICON_PRESETS.findIndex((preset) => preset.name === selectedIconName);
  const selectedIconLabel = dict.dailySection.iconLabels[selectedIconIndex] ?? DAILY_ICON_LABEL_FALLBACKS[selectedIconIndex] ?? dict.dailySection.defaultIcon;
  const timeButtonLabel = values.toCompleteBefore ? values.toCompleteBefore : dict.dailySection.noTimeSelected;
  const isFormValid = taskTitle.length > 0;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isFormValid || isSaving || isDeleting) {
      return;
    }

    await onSubmit();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100dvh-1rem)] overflow-hidden p-4 sm:max-w-[min(92vw,60rem)] sm:p-6">
        <form onSubmit={handleSubmit} className="max-h-[calc(100dvh-4.5rem)] space-y-4 overflow-y-auto pr-1 sm:space-y-5 sm:pr-2">
          <DialogHeader>
            <DialogTitle>{mode === "create" ? dict.dailySection.addTask : dict.dailySection.editTask}</DialogTitle>
            <DialogDescription>{dict.dailySection.subtitle}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="daily-task-title" className="text-[12px] font-semibold uppercase tracking-[0.125px] text-warm-gray-300 dark:text-[#9e9993]">
                  {dict.dailySection.taskTitle}
                </Label>
                <Input
                  id="daily-task-title"
                  value={values.title}
                  onChange={(event) => onChange({ ...values, title: event.target.value })}
                  placeholder={dict.dailySection.taskTitle}
                  autoFocus
                  maxLength={120}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="daily-task-notes" className="text-[12px] font-semibold uppercase tracking-[0.125px] text-warm-gray-300 dark:text-[#9e9993]">
                  {dict.dailySection.taskNotes}
                </Label>
                <textarea
                  id="daily-task-notes"
                  value={values.notes}
                  onChange={(event) => onChange({ ...values, notes: event.target.value })}
                  placeholder={dict.dailySection.taskNotesPlaceholder}
                  rows={3}
                  className="min-h-20 w-full rounded-[4px] border border-[rgba(0,0,0,0.1)] bg-white px-3 py-2 text-[16px] text-[rgba(0,0,0,0.9)] outline-none transition-all placeholder:text-warm-gray-300 focus-visible:border-badge-blue-text focus-visible:ring-2 focus-visible:ring-badge-blue-text/20 dark:border-[rgba(255,255,255,0.14)] dark:bg-[#201f1d] dark:text-[rgba(255,255,255,0.92)] dark:placeholder:text-[#8f8a84]"
                  maxLength={500}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[12px] font-semibold uppercase tracking-[0.125px] text-warm-gray-300 dark:text-[#9e9993]">
                  {dict.dailySection.parentTask}
                </Label>
                <div className={PARENT_OPTIONS_PANEL_CLASS}>
                  <button
                    type="button"
                    onClick={() => onChange({ ...values, parentId: null })}
                    className={cn(
                      "flex w-full items-center justify-between rounded-[8px] px-3 py-2 text-left text-sm transition-colors",
                      values.parentId === null
                        ? "bg-warm-white text-[rgba(0,0,0,0.95)] dark:bg-[#252320] dark:text-[rgba(255,255,255,0.95)]"
                        : "text-warm-gray-500 hover:bg-warm-white dark:text-[#beb8b1] dark:hover:bg-[#23211f]",
                    )}
                  >
                    <span>{dict.dailySection.noParent}</span>
                    <span className="text-[11px] text-warm-gray-300">{dict.dailySection.defaultIcon}</span>
                  </button>

                  {parentOptions.map((option) => {
                    const isSelected = values.parentId === option.id;

                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => onChange({ ...values, parentId: option.id })}
                        className={cn(
                          "flex w-full items-center gap-2 rounded-[8px] px-3 py-2 text-left text-sm transition-colors",
                          isSelected
                            ? "bg-warm-white text-[rgba(0,0,0,0.95)] dark:bg-[#252320] dark:text-[rgba(255,255,255,0.95)]"
                            : "text-warm-gray-500 hover:bg-warm-white dark:text-[#beb8b1] dark:hover:bg-[#23211f]",
                        )}
                      >
                        <span className="text-[11px] text-warm-gray-300 dark:text-[#9e9993]" style={{ paddingLeft: option.depth * 12 }}>
                          {option.depth > 0 ? "↳" : "•"}
                        </span>
                        <span className="min-w-0 truncate">{option.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[12px] font-semibold uppercase tracking-[0.125px] text-warm-gray-300 dark:text-[#9e9993]">
                  {dict.dailySection.dueTime}
                </Label>
                <div className={TIME_PICKER_PANEL_CLASS}>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-between"
                    onClick={() => setIsTimePickerOpen((current) => !current)}
                  >
                    <span>{timeButtonLabel}</span>
                    <Clock3 className="size-4" />
                  </Button>

                  {isTimePickerOpen ? (
                    <div className="grid grid-cols-2 gap-2">
                      <TimeWheelColumn
                        label={dict.dailySection.hourLabel}
                        values={TIME_HOUR_VALUES}
                        selectedValue={selectedHour}
                        onSelect={(hour) => {
                          const nextMinute = selectedMinute ?? 0;
                          onChange({ ...values, toCompleteBefore: formatClockValue(hour, nextMinute) });
                        }}
                      />
                      <TimeWheelColumn
                        label={dict.dailySection.minuteLabel}
                        values={TIME_MINUTE_VALUES}
                        selectedValue={selectedMinute}
                        onSelect={(minute) => {
                          const nextHour = selectedHour ?? 0;
                          onChange({ ...values, toCompleteBefore: formatClockValue(nextHour, minute) });
                        }}
                      />
                    </div>
                  ) : null}

                  <div className="flex items-center justify-between gap-2 text-[12px] text-warm-gray-300 dark:text-[#9e9993]">
                    <span>{dict.dailySection.chooseTime}</span>
                    <button
                      type="button"
                      className="font-semibold text-badge-blue-text hover:underline"
                      onClick={() => onChange({ ...values, toCompleteBefore: "" })}
                    >
                      {dict.dailySection.clearTime}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-[12px] border border-[rgba(0,0,0,0.1)] bg-warm-white p-3 dark:border-[rgba(255,255,255,0.14)] dark:bg-[#23211f] sm:p-4">
                <div className="flex items-start gap-3">
                  <div
                    className="flex size-12 items-center justify-center rounded-[12px] border border-[rgba(0,0,0,0.08)]"
                    style={{
                      backgroundColor: getDailySwatchSurface(selectedColor, isDarkMode),
                      color: getDailyIconTone(selectedColor, isDarkMode),
                    }}
                  >
                    <SelectedIcon className="size-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.125px] text-warm-gray-300 dark:text-[#9e9993]">
                      {dict.dailySection.color} / {dict.dailySection.icon}
                    </p>
                    <p className="truncate text-[16px] font-semibold text-[rgba(0,0,0,0.95)] dark:text-[rgba(255,255,255,0.95)]">
                      {taskTitle || dict.dailySection.emptyTitle}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <Label className="text-[12px] font-semibold uppercase tracking-[0.125px] text-warm-gray-300 dark:text-[#9e9993]">
                    {dict.dailySection.colorPickerTitle}
                  </Label>
                  <span className="text-[12px] text-warm-gray-300 dark:text-[#9e9993]">
                    {selectedColor === DEFAULT_DAILY_COLOR ? dict.dailySection.defaultColor : selectedColor}
                  </span>
                </div>
                <div className={COLOR_PICKER_SCROLL_CLASS}>
                  <div className="grid grid-cols-5 gap-2">
                    {DAILY_COLOR_PRESETS.map((preset) => (
                      <DailyColorSwatch
                        key={preset.value}
                        color={preset.value}
                        selected={values.color === preset.value}
                        isDarkMode={isDarkMode}
                        onSelect={() => onChange({ ...values, color: preset.value })}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <Label className="text-[12px] font-semibold uppercase tracking-[0.125px] text-warm-gray-300 dark:text-[#9e9993]">
                    {dict.dailySection.iconPickerTitle}
                  </Label>
                  <span className="text-[12px] text-warm-gray-300 dark:text-[#9e9993]">
                    {selectedIconName === DEFAULT_DAILY_ICON ? dict.dailySection.defaultIcon : selectedIconLabel}
                  </span>
                </div>
                <div className={ICON_PICKER_SCROLL_CLASS}>
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {DAILY_ICON_PRESETS.map((preset, index) => (
                      <DailyIconSwatch
                        key={preset.name}
                        iconName={preset.name}
                        selected={values.iconName === preset.name}
                        color={selectedColor}
                        label={dict.dailySection.iconLabels[index] ?? DAILY_ICON_LABEL_FALLBACKS[index] ?? preset.name}
                        isDarkMode={isDarkMode}
                        onSelect={() => onChange({ ...values, iconName: preset.name })}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="items-center justify-between gap-3 sm:flex-row">
            <div className="text-[12px] text-warm-gray-300 dark:text-[#9e9993]">{dict.dailySection.resetHint}</div>
            <div className="flex items-center gap-2">
              {mode === "edit" && onDelete ? (
                <Button type="button" variant="destructive" onClick={onDelete} disabled={isSaving || isDeleting}>
                  {isDeleting ? dict.common.saving : dict.dailySection.deleteTask}
                </Button>
              ) : null}
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving || isDeleting}>
                {dict.common.cancel}
              </Button>
              <Button type="submit" disabled={!isFormValid || isSaving || isDeleting}>
                {isSaving ? dict.common.saving : dict.common.save}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
