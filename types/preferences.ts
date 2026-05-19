export const THEME_MODES = ["auto", "light", "dark"] as const;
export const LANGUAGE_MODES = ["auto", "en", "ja", "zh-CN"] as const;

export type ThemeMode = (typeof THEME_MODES)[number];
export type LanguageMode = (typeof LANGUAGE_MODES)[number];

export type EffectiveTheme = "light" | "dark";
export type SupportedLanguage = Exclude<LanguageMode, "auto">;

export type UserPreferences = {
  themeMode: ThemeMode;
  languageMode: LanguageMode;
};
