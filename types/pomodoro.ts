export type Phase = "focus" | "break";

export type TimerType = {
  id: number;
  name: string;
  focusDurationMinutes: number;
  breakDurationMinutes: number;
  isPreset: boolean;
};

export type PomodoroSettings = {
  autoStartBreak: boolean;
  autoStartPomodoros: boolean;
  selectedTimerTypeId: number | null;
};
