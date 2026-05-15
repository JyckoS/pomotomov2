"use client";

import { useState } from "react";

import { AddTimerTypeDialog } from "./add-timer-type-dialog";
import { PomodoroSettingsDialog } from "./settings-dialog";
import { TimerDisplay } from "./timer-display";
import { TimerTypePanel } from "./timer-type-panel";
import { usePomodoro } from "@/components/dashboard/pomodoro/pomodoro-provider";

export function PomodoroClient() {
  const {
    timerTypes,
    settings,
    phase,
    isRunning,
    selectedTimerType,
    selectedTimerTypeId,
    timeLeftSeconds,
    progress,
    settingsError,
    toggleRunning,
    skipPhase,
    selectTimerType,
    updateSettings,
    onTimerTypeCreated,
  } = usePomodoro();
  const [isAddTimerDialogOpen, setIsAddTimerDialogOpen] = useState(false);

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="relative rounded-[16px] border border-[rgba(0,0,0,0.1)] bg-gradient-to-b from-white to-[#f6f9fc] p-4 shadow-[rgba(0,0,0,0.04)_0px_4px_18px,rgba(0,0,0,0.027)_0px_2.025px_7.84688px,rgba(0,0,0,0.02)_0px_0.8px_2.925px,rgba(0,0,0,0.01)_0px_0.175px_1.04062px] sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-[26px] font-bold leading-[1.23] tracking-[-0.625px] text-[rgba(0,0,0,0.95)]">
              Pomodoro Timer
            </h3>
            <p className="mt-1 text-sm text-[#615d59]">Designed to keep you in flow with focus and break cycles.</p>
          </div>
          <PomodoroSettingsDialog
            settings={settings}
            settingsError={settingsError}
            onUpdateSettings={updateSettings}
          />
        </div>

        <div className="mt-5 space-y-4">
          <TimerDisplay
            phase={phase}
            isRunning={isRunning}
            timeLeftSeconds={timeLeftSeconds}
            selectedTimerType={selectedTimerType}
            progress={progress}
            onToggleRunning={toggleRunning}
            onSkip={skipPhase}
          />

          <TimerTypePanel
            timerTypes={timerTypes}
            selectedTimerTypeId={selectedTimerTypeId}
            onSelectTimerType={selectTimerType}
            onOpenAddDialog={() => setIsAddTimerDialogOpen(true)}
          />
        </div>
      </div>

      <AddTimerTypeDialog
        open={isAddTimerDialogOpen}
        onOpenChange={setIsAddTimerDialogOpen}
        onTimerTypeCreated={onTimerTypeCreated}
      />
    </div>
  );
}
