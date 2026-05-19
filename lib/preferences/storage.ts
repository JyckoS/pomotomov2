import type { LanguageMode, ThemeMode } from "@/types/preferences";
import { normalizeLanguageMode, normalizeThemeMode } from "@/lib/preferences/modes";

export const LOCAL_PREFERENCES_KEY = "pomotomo.preferences.v1";

type LocalPreferencesPayload = {
  themeMode: ThemeMode;
  languageMode: LanguageMode;
  pendingSync: boolean;
  updatedAt: number;
};

export function readLocalPreferences(): LocalPreferencesPayload | null {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(LOCAL_PREFERENCES_KEY);
  if (!raw) return null;

  let parsed: Partial<LocalPreferencesPayload>;
  try {
    parsed = JSON.parse(raw) as Partial<LocalPreferencesPayload>;
  } catch {
    return null;
  }

  if (typeof parsed !== "object" || !parsed) return null;

  return {
    themeMode: normalizeThemeMode(parsed.themeMode),
    languageMode: normalizeLanguageMode(parsed.languageMode),
    pendingSync: parsed.pendingSync === true,
    updatedAt: typeof parsed.updatedAt === "number" ? parsed.updatedAt : Date.now(),
  };
}

export function writeLocalPreferences(payload: LocalPreferencesPayload) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LOCAL_PREFERENCES_KEY, JSON.stringify(payload));
}
