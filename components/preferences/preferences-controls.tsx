"use client";

import { Globe, Moon, Sun, SunMoon } from "lucide-react";
import type { ReactNode } from "react";

import { usePreferences } from "@/components/preferences/preferences-provider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { LanguageMode, ThemeMode } from "@/types/preferences";

function ThemeOptionButton({
  value,
  current,
  onChange,
  children,
  icon,
}: {
  value: ThemeMode;
  current: ThemeMode;
  onChange: (mode: ThemeMode) => void;
  children: ReactNode;
  icon: ReactNode;
}) {
  const isActive = value === current;

  return (
    <Button
      type="button"
      variant={isActive ? "default" : "outline"}
      size="sm"
      className={`h-8 px-2.5 text-xs ${
        isActive
          ? "shadow-[rgba(0,0,0,0.08)_0px_2px_8px]"
          : "bg-white/80 hover:bg-[#f6f5f4] dark:bg-transparent dark:hover:bg-[#23211f]"
      }`}
      onClick={() => onChange(value)}
    >
      {icon}
      {children}
    </Button>
  );
}

export function PreferencesControls({
  compact = false,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  const {
    themeMode,
    languageMode,
    setThemeMode,
    setLanguageMode,
    dictionary: dict,
    syncError,
  } = usePreferences();

  return (
    <section
      className={`rounded-[12px] border border-[rgba(0,0,0,0.1)] bg-white/95 p-3 shadow-[rgba(0,0,0,0.04)_0px_4px_18px,rgba(0,0,0,0.027)_0px_2.025px_7.84688px,rgba(0,0,0,0.02)_0px_0.8px_2.925px,rgba(0,0,0,0.01)_0px_0.175px_1.04062px] dark:border-[rgba(255,255,255,0.12)] dark:bg-[#171614]/95 ${className ?? ""}`}
      aria-label="Preferences"
    >
      <div className={`grid ${compact ? "gap-2" : "gap-3"}`}>
        <div className="space-y-1.5">
          <Label className="text-[11px] font-semibold tracking-[0.125px] text-[#a39e98] dark:text-[#a8a4a0]">
            {dict.common.theme}
          </Label>
          <div className="flex flex-wrap gap-1.5">
            <ThemeOptionButton value="auto" current={themeMode} onChange={(mode) => void setThemeMode(mode)} icon={<SunMoon className="size-3.5" />}>
              {dict.common.auto}
            </ThemeOptionButton>
            <ThemeOptionButton value="light" current={themeMode} onChange={(mode) => void setThemeMode(mode)} icon={<Sun className="size-3.5" />}>
              {dict.common.light}
            </ThemeOptionButton>
            <ThemeOptionButton value="dark" current={themeMode} onChange={(mode) => void setThemeMode(mode)} icon={<Moon className="size-3.5" />}>
              {dict.common.dark}
            </ThemeOptionButton>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-[11px] font-semibold tracking-[0.125px] text-[#a39e98] dark:text-[#a8a4a0]">
            {dict.common.language}
          </Label>
          <div className="relative">
            <Globe className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-[#615d59] dark:text-[#b6b1ab]" />
            <select
              value={languageMode}
              onChange={(event) => void setLanguageMode(event.target.value as LanguageMode)}
              className="h-8 w-full rounded-[8px] border border-[rgba(0,0,0,0.1)] bg-white pl-8 pr-2 text-xs font-medium text-[rgba(0,0,0,0.95)] outline-none transition-all focus-visible:border-[#097fe8] focus-visible:ring-2 focus-visible:ring-[#097fe8]/20 dark:border-[rgba(255,255,255,0.14)] dark:bg-[#201f1d] dark:text-[rgba(255,255,255,0.95)]"
            >
              <option value="auto">{dict.common.auto}</option>
              <option value="en">{dict.common.english}</option>
              <option value="ja">{dict.common.japanese}</option>
              <option value="zh-CN">{dict.common.chineseSimplified}</option>
            </select>
          </div>
        </div>

        {syncError ? <p className="text-[11px] text-[#dd5b00]">{syncError}</p> : null}
      </div>
    </section>
  );
}
