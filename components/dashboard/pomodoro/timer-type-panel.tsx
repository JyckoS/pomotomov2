"use client";

import { ChevronDown, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { usePreferences } from "@/components/preferences/preferences-provider";

import type { TimerType } from "@/types/pomodoro";

export function TimerTypePanel({
  timerTypes,
  selectedTimerTypeId,
  onSelectTimerType,
  onOpenAddDialog,
}: {
  timerTypes: TimerType[];
  selectedTimerTypeId: string | null;
  onSelectTimerType: (id: string) => void;
  onOpenAddDialog: () => void;
}) {
  const pref = usePreferences();
  return (
    <div className="rounded-[16px] border border-[rgba(0,0,0,0.1)] bg-white p-4 shadow-[rgba(0,0,0,0.04)_0px_4px_18px,rgba(0,0,0,0.027)_0px_2.025px_7.84688px,rgba(0,0,0,0.02)_0px_0.8px_2.925px,rgba(0,0,0,0.01)_0px_0.175px_1.04062px] dark:border-[rgba(255,255,255,0.12)] dark:bg-[#171614] dark:shadow-[rgba(0,0,0,0.35)_0px_4px_18px,rgba(0,0,0,0.22)_0px_2.025px_7.84688px,rgba(0,0,0,0.16)_0px_0.8px_2.925px,rgba(0,0,0,0.12)_0px_0.175px_1.04062px] sm:p-5">
      <p className="text-xs font-semibold tracking-[0.125px] text-[#a39e98] dark:text-[#9e9993]">{pref.dictionary.pomodoroSection.timerType}</p>

      <div className="relative mt-2">
        <select
          value={selectedTimerTypeId ?? ""}
          onChange={(event) => onSelectTimerType(event.target.value)}
          className="h-10 w-full appearance-none rounded-[8px] border border-[rgba(0,0,0,0.1)] bg-[#f6f5f4] px-3 pr-10 text-sm font-semibold text-[rgba(0,0,0,0.95)] outline-none transition-colors focus-visible:border-[#097fe8] focus-visible:ring-2 focus-visible:ring-[#097fe8]/20 dark:border-[rgba(255,255,255,0.14)] dark:bg-[#201f1d] dark:text-[rgba(255,255,255,0.95)]"
        >
          {timerTypes.map((timerType) => (
            <option key={timerType.id} value={timerType.id}>
              {timerType.name} ({timerType.focusDurationMinutes}/{timerType.breakDurationMinutes})
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-[#615d59] dark:text-[#b6b1ab]" />
      </div>
      <p className="mt-2 text-xs text-[#615d59] dark:text-[#bbb6af]">
        {timerTypes.find((timerType) => timerType.id === selectedTimerTypeId)?.name ?? pref.dictionary.pomodoroSection.selectTimerType}
      </p>

      <Button type="button" variant="outline" className="mt-4 w-full" onClick={onOpenAddDialog}>
        <Plus className="size-4" />
        {pref.dictionary.pomodoroSection.addTimerType}
      </Button>
    </div>
  );
}
