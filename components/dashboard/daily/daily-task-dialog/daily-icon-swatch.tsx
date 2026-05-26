"use client";

import { FileText } from "lucide-react";

import { getDailyIconTone } from "@/lib/daily/color";
import { DAILY_ICON_PRESETS } from "@/lib/daily/presets";
import { cn } from "@/lib/utils";

type DailyIconSwatchProps = {
  iconName: string;
  label: string;
  selected: boolean;
  color: string;
  isDarkMode: boolean;
  onSelect: () => void;
};

export function DailyIconSwatch({ iconName, label, selected, color, isDarkMode, onSelect }: DailyIconSwatchProps) {
  const iconPreset = DAILY_ICON_PRESETS.find((preset) => preset.name === iconName) ?? DAILY_ICON_PRESETS[0];
  const Icon = iconPreset?.icon ?? FileText;
  const tone = getDailyIconTone(color, isDarkMode);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-[10px] border px-2 py-3 text-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-badge-blue-text",
        selected
          ? "border-badge-blue-text bg-badge-blue-bg ring-2 ring-badge-blue-text/20 dark:bg-[#13263a]"
          : "border-[rgba(0,0,0,0.1)] bg-white hover:-translate-y-0.5 hover:shadow-[rgba(0,0,0,0.04)_0px_4px_18px] dark:border-[rgba(255,255,255,0.14)] dark:bg-[#201f1d]",
      )}
      style={{ color: tone }}
      aria-pressed={selected}
    >
      <Icon className="size-5" />
      <span className="truncate text-[11px] font-medium text-warm-gray-500 dark:text-[#bab6b1]">{label}</span>
    </button>
  );
}