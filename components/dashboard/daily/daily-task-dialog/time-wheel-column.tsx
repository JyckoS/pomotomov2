"use client";

import { cn } from "@/lib/utils";

type TimeWheelColumnProps = {
  label: string;
  values: number[];
  selectedValue: number | null;
  onSelect: (value: number) => void;
};

export function TimeWheelColumn({ label, values, selectedValue, onSelect }: TimeWheelColumnProps) {
  return (
    <div className="space-y-2">
      <p className="text-[12px] font-semibold uppercase tracking-[0.125px] text-warm-gray-300 dark:text-[#9e9993]">{label}</p>
      <div className="max-h-44 overflow-y-auto rounded-[10px] border border-[rgba(0,0,0,0.1)] p-1.5 dark:border-[rgba(255,255,255,0.14)]">
        <div className="grid grid-cols-1 gap-1">
          {values.map((value) => {
            const isSelected = selectedValue === value;

            return (
              <button
                key={value}
                type="button"
                onClick={() => onSelect(value)}
                className={cn(
                  "rounded-[8px] px-3 py-2 text-center text-sm font-medium transition-colors",
                  isSelected
                    ? "bg-badge-blue-bg text-badge-blue-text dark:bg-[#13263a] dark:text-[#97c8f5]"
                    : "text-warm-gray-500 hover:bg-warm-white dark:text-warm-gray-300 dark:hover:bg-[#23211f]",
                )}
              >
                {String(value).padStart(2, "0")}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}