"use client";

import { type FormEvent, useState } from "react";

import { usePreferences } from "@/components/preferences/preferences-provider";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { TimerType } from "@/types/pomodoro";

export function AddTimerTypeDialog({
  open,
  onOpenChange,
  onTimerTypeCreated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTimerTypeCreated: (timerType: TimerType) => void;
}) {
  const pref = usePreferences();
  const [isCreatingTimerType, setIsCreatingTimerType] = useState(false);
  const [createTimerError, setCreateTimerError] = useState<string | null>(null);
  const [newTimerName, setNewTimerName] = useState("");
  const [newFocusDuration, setNewFocusDuration] = useState("25");
  const [newBreakDuration, setNewBreakDuration] = useState("5");

  const handleCreateTimerType = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCreateTimerError(null);

    const focusDurationMinutes = Number(newFocusDuration);
    const breakDurationMinutes = Number(newBreakDuration);

    if (!newTimerName.trim()) {
      setCreateTimerError(pref.dictionary.pomodoroSection.addTimerTypeError);
      return;
    }

    if (!Number.isInteger(focusDurationMinutes) || focusDurationMinutes < 1 || focusDurationMinutes > 240) {
      setCreateTimerError(pref.dictionary.pomodoroSection.addTimerTypeError);
      return;
    }

    if (!Number.isInteger(breakDurationMinutes) || breakDurationMinutes < 1 || breakDurationMinutes > 120) {
      setCreateTimerError(pref.dictionary.pomodoroSection.addTimerTypeError);
      return;
    }

    setIsCreatingTimerType(true);

    const response = await fetch("/api/pomodoro/timer-types", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: newTimerName.trim(),
        focusDurationMinutes,
        breakDurationMinutes,
      }),
    }).catch(() => null);

    if (!response || !response.ok) {
      setCreateTimerError(pref.dictionary.pomodoroSection.addTimerTypeError);
      setIsCreatingTimerType(false);
      return;
    }

    const payload: { timerType: TimerType } = await response.json();
    onTimerTypeCreated(payload.timerType);
    setNewTimerName("");
    setNewFocusDuration("25");
    setNewBreakDuration("5");
    setCreateTimerError(null);
    setIsCreatingTimerType(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{pref.dictionary.pomodoroSection.addDialogTitle}</DialogTitle>
          <DialogDescription>{pref.dictionary.pomodoroSection.addDialogDescription}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleCreateTimerType} className="grid gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="timer-name" className="text-xs font-semibold text-[#615d59] dark:text-[#bbb6af]">
              {pref.dictionary.pomodoroSection.timerName}
            </Label>
            <Input
              id="timer-name"
              value={newTimerName}
              onChange={(event) => setNewTimerName(event.target.value)}
              placeholder={pref.dictionary.pomodoroSection.timerNamePlaceholder}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="focus-duration" className="text-xs font-semibold text-[#615d59] dark:text-[#bbb6af]">
                {pref.dictionary.pomodoroSection.focusMins}
              </Label>
              <Input
                id="focus-duration"
                type="number"
                min={1}
                max={240}
                value={newFocusDuration}
                onChange={(event) => setNewFocusDuration(event.target.value)}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="break-duration" className="text-xs font-semibold text-[#615d59] dark:text-[#bbb6af]">
                {pref.dictionary.pomodoroSection.breakMins}
              </Label>
              <Input
                id="break-duration"
                type="number"
                min={1}
                max={120}
                value={newBreakDuration}
                onChange={(event) => setNewBreakDuration(event.target.value)}
              />
            </div>
          </div>

          {createTimerError ? <p className="text-sm text-[#dd5b00] dark:text-[#ff8f63]">{createTimerError}</p> : null}

          <Button type="submit" disabled={isCreatingTimerType}>
            {isCreatingTimerType ? pref.dictionary.pomodoroSection.savingTimer : pref.dictionary.pomodoroSection.addTimerType}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
