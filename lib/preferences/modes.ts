import {
  LANGUAGE_MODES,
  THEME_MODES,
  type EffectiveTheme,
  type LanguageMode,
  type SupportedLanguage,
  type ThemeMode,
} from "@/types/preferences";

export const FALLBACK_THEME_MODE: ThemeMode = "auto";
export const FALLBACK_LANGUAGE_MODE: LanguageMode = "auto";
export const FALLBACK_LANGUAGE: SupportedLanguage = "en";

export function isThemeMode(value: unknown): value is ThemeMode {
  return typeof value === "string" && (THEME_MODES as readonly string[]).includes(value);
}

export function isLanguageMode(value: unknown): value is LanguageMode {
  return typeof value === "string" && (LANGUAGE_MODES as readonly string[]).includes(value);
}

export function normalizeThemeMode(value: unknown): ThemeMode {
  return isThemeMode(value) ? value : FALLBACK_THEME_MODE;
}

export function normalizeLanguageMode(value: unknown): LanguageMode {
  return isLanguageMode(value) ? value : FALLBACK_LANGUAGE_MODE;
}

export function resolveEffectiveTheme(mode: ThemeMode, now = new Date()): EffectiveTheme {
  if (mode === "light") return "light";
  if (mode === "dark") return "dark";

  const hour = now.getHours();
  return hour >= 18 || hour < 6 ? "dark" : "light";
}

export function mapToSupportedLanguage(raw: string | null | undefined): SupportedLanguage {
  const value = raw?.toLowerCase() ?? "";

  if (value.startsWith("ja")) return "ja";
  if (value.startsWith("zh")) return "zh-CN";
  if (value.startsWith("en")) return "en";
  return FALLBACK_LANGUAGE;
}

export function resolveEffectiveLanguage(
  mode: LanguageMode,
  browserLanguages: readonly string[] = [],
): SupportedLanguage {
  if (mode !== "auto") {
    return mode;
  }

  if (browserLanguages.length === 0) {
    return FALLBACK_LANGUAGE;
  }

  for (const language of browserLanguages) {
    const mapped = mapToSupportedLanguage(language);
    if (mapped) return mapped;
  }

  return FALLBACK_LANGUAGE;
}
