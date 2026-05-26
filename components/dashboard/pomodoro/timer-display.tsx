"use client";

import { Pause, Play, SkipForward } from "lucide-react";

import { Button } from "@/components/ui/button";
import { usePreferences } from "@/components/preferences/preferences-provider";

import type { Phase, TimerType } from "@/types/pomodoro";
import { formatTimer } from "@/lib/pomodoro/utils";

export function TimerDisplay({
  phase,
  isRunning,
  timeLeftSeconds,
  selectedTimerType,
  progress,
  onToggleRunning,
  onSkip,
}: {
  phase: Phase;
  isRunning: boolean;
  timeLeftSeconds: number;
  selectedTimerType: TimerType | null;
  progress: number;
  onToggleRunning: () => void;
  onSkip: () => void;
}) {
  const { dictionary: dict, effectiveTheme } = usePreferences();
  const circleSize = 320;
  const strokeWidth = 14;
  const radius = (circleSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - Math.min(Math.max(progress, 0), 1));
  const isDark = effectiveTheme === "dark";

  return (
    <div className="relative overflow-hidden rounded-[16px] border border-[rgba(0,0,0,0.1)] bg-gradient-to-br from-[#ffffff] via-[#f7fbff] to-[#eef6ff] p-4 shadow-[rgba(0,0,0,0.04)_0px_4px_18px,rgba(0,0,0,0.027)_0px_2.025px_7.84688px,rgba(0,0,0,0.02)_0px_0.8px_2.925px,rgba(0,0,0,0.01)_0px_0.175px_1.04062px] dark:border-[rgba(255,255,255,0.12)] dark:bg-gradient-to-br dark:from-[#171614] dark:via-[#141311] dark:to-[#12110f] dark:shadow-[rgba(0,0,0,0.35)_0px_4px_18px,rgba(0,0,0,0.22)_0px_2.025px_7.84688px,rgba(0,0,0,0.16)_0px_0.8px_2.925px,rgba(0,0,0,0.12)_0px_0.175px_1.04062px] sm:p-6">
      <div className="pointer-events-none absolute -top-20 -left-16 h-64 w-64 rounded-full bg-[#62aef0]/20 blur-3xl dark:bg-[#62aef0]/10" />
      <div className="pointer-events-none absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-[#0075de]/12 blur-3xl dark:bg-[#0075de]/8" />

      <div className="relative flex flex-col items-center">
        <p className="rounded-full border border-[rgba(9,127,232,0.15)] bg-[#f2f9ff] px-3 py-1 text-xs font-semibold tracking-[0.125px] text-[#097fe8] dark:border-[#62aef0]/25 dark:bg-[#14334f] dark:text-[#97c8f5]">
          {phase === "focus" ? dict.pomodoroSection.focusTimeBadge : dict.pomodoroSection.breakTimeBadge}
        </p>

        <div className="relative mt-4 flex items-center justify-center">
          <svg width={circleSize} height={circleSize} className="-rotate-90">
            <circle
              cx={circleSize / 2}
              cy={circleSize / 2}
              r={radius}
              stroke={isDark ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.12)"}
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            <circle
              cx={circleSize / 2}
              cy={circleSize / 2}
              r={radius}
              stroke={phase === "focus" ? "#0075de" : "#2a9d99"}
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeLinecap="round"
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={strokeDashoffset}
              style={{ transition: "stroke-dashoffset 1s linear, stroke 200ms ease" }}
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-xs font-semibold tracking-[0.125px] text-[#a39e98] dark:text-[#9e9993]">
              {phase === "focus" ? dict.pomodoroSection.phaseFocus : dict.pomodoroSection.phaseBreak}
            </p>
            <p className="mt-1 text-[48px] font-bold leading-[1.0] tracking-[-1.5px] text-[rgba(0,0,0,0.95)] dark:text-[rgba(255,255,255,0.95)]">
              {formatTimer(timeLeftSeconds)}
            </p>
            <p className="mt-1 text-xs text-[#615d59] dark:text-[#bbb6af]">
              {selectedTimerType ? (
                `${selectedTimerType.focusDurationMinutes}m ${dict.pomodoroSection.phaseFocus.toLowerCase()} • ${selectedTimerType.breakDurationMinutes}m ${dict.pomodoroSection.phaseBreak.toLowerCase()}`
              ) : (
                dict.pomodoroSection.noTimerSelected
              )}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <Button
            type="button"
            onClick={onToggleRunning}
            disabled={!selectedTimerType}
            className="min-w-[7.5rem]"
          >
            {isRunning ? <Pause className="size-4" /> : <Play className="size-4" />}
            {isRunning ? dict.pomodoroSection.pause : dict.pomodoroSection.continue}
          </Button>
          <Button type="button" variant="outline" onClick={onSkip} disabled={!selectedTimerType}>
            <SkipForward className="size-4" />
            {phase === "focus" ? dict.pomodoroSection.skipToBreak : dict.pomodoroSection.skipToFocus}
          </Button>
        </div>
      </div>
    </div>
  );
}
