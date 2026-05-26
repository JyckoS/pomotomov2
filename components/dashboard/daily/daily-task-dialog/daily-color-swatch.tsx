"use client";

import { getDailySwatchSurface, mixHexColor } from "@/lib/daily/color";
import { cn } from "@/lib/utils";

type DailyColorSwatchProps = {
  color: string;
  selected: boolean;
  isDarkMode: boolean;
  onSelect: () => void;
};

export function DailyColorSwatch({ color, selected, isDarkMode, onSelect }: DailyColorSwatchProps) {
  const surface = getDailySwatchSurface(color, isDarkMode);
  const iconTone = mixHexColor(color, isDarkMode ? "#ffffff" : "#000000", isDarkMode ? 0.34 : 0.22);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex aspect-square items-center justify-center rounded-[10px] border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-badge-blue-text",
        selected
          ? "scale-[0.985] border-badge-blue-text ring-2 ring-badge-blue-text/20"
          : "border-[rgba(0,0,0,0.1)] hover:-translate-y-0.5 hover:shadow-[rgba(0,0,0,0.04)_0px_4px_18px] dark:border-[rgba(255,255,255,0.14)]",
      )}
      style={{ backgroundColor: surface, color: iconTone }}
      aria-pressed={selected}
    >
      <span className="sr-only">{color}</span>
    </button>
  );
}