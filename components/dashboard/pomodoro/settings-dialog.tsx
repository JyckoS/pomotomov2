"use client";

import { Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import type { PomodoroSettings } from "@/types/pomodoro";

export function PomodoroSettingsDialog({
  settings,
  settingsError,
  onUpdateSettings,
}: {
  settings: PomodoroSettings;
  settingsError: string | null;
  onUpdateSettings: (patch: Partial<PomodoroSettings>) => Promise<void>;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="icon" aria-label="Open timer settings">
          <Settings className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Timer Settings</DialogTitle>
          <DialogDescription>Choose how each cycle should continue.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <label className="flex items-center justify-between gap-3 rounded-[8px] border border-[rgba(0,0,0,0.1)] p-3">
            <div className="space-y-1">
              <p className="text-[15px] font-semibold text-[rgba(0,0,0,0.95)]">Auto start break</p>
              <p className="text-xs text-[#615d59]">Automatically start break when focus ends.</p>
            </div>
            <input
              type="checkbox"
              checked={settings.autoStartBreak}
              onChange={(event) => void onUpdateSettings({ autoStartBreak: event.target.checked })}
              className="size-4 accent-[#0075de]"
            />
          </label>

          <label className="flex items-center justify-between gap-3 rounded-[8px] border border-[rgba(0,0,0,0.1)] p-3">
            <div className="space-y-1">
              <p className="text-[15px] font-semibold text-[rgba(0,0,0,0.95)]">Auto start pomodoros</p>
              <p className="text-xs text-[#615d59]">Automatically start focus when break ends.</p>
            </div>
            <input
              type="checkbox"
              checked={settings.autoStartPomodoros}
              onChange={(event) => void onUpdateSettings({ autoStartPomodoros: event.target.checked })}
              className="size-4 accent-[#0075de]"
            />
          </label>

          {settingsError ? <p className="text-sm text-[#dd5b00]">{settingsError}</p> : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
