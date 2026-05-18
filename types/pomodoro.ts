export type Phase = "focus" | "break";

export type TimerType = {
  id: string;
  name: string;
  focusDurationMinutes: number;
  breakDurationMinutes: number;
  isPreset: boolean;
};

export type PomodoroSettings = {
  autoStartBreak: boolean;
  autoStartPomodoros: boolean;
  selectedTimerTypeId: string | null;
};
