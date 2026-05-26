export const TIME_HOUR_VALUES = Array.from({ length: 24 }, (_, index) => index);
export const TIME_MINUTE_VALUES = Array.from({ length: 60 }, (_, index) => index);

export const PARENT_OPTIONS_PANEL_CLASS =
  "max-h-44 space-y-2 overflow-y-auto rounded-[8px] border border-[rgba(0,0,0,0.1)] p-2 dark:border-[rgba(255,255,255,0.14)]";
export const COLOR_PICKER_SCROLL_CLASS = "max-h-40 overflow-y-auto pr-1";
export const ICON_PICKER_SCROLL_CLASS = "max-h-40 overflow-y-auto pr-1";
export const TIME_PICKER_PANEL_CLASS = "space-y-2 rounded-[10px] border border-[rgba(0,0,0,0.1)] p-2 dark:border-[rgba(255,255,255,0.14)]";

export const DAILY_ICON_LABEL_FALLBACKS = [
  "Document",
  "Checklist",
  "Calendar",
  "Clock",
  "Todo",
  "Sparkles",
  "Book",
  "Briefcase",
  "Brain",
  "Goal",
  "Heart",
  "Lightbulb",
  "Clipboard",
  "Star",
  "Sun",
  "Moon",
  "Shield",
  "Target",
  "Rocket",
  "Flower",
  "Pine Tree",
  "Flame",
  "Bell",
  "Message",
  "Pencil",
  "Folder",
  "Archive",
  "Badge",
  "Check",
  "Wand",
] as const;

export function formatClockValue(hour: number, minute: number) {
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

export function parseClockValue(value: string) {
  const [hourPart, minutePart] = value.split(":");
  const hour = Number(hourPart);
  const minute = Number(minutePart);

  if (Number.isNaN(hour) || Number.isNaN(minute)) {
    return { hour: null, minute: null };
  }

  return { hour, minute };
}