"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from "react";

import { getDictionary } from "@/lib/preferences/i18n";
import {
  FALLBACK_LANGUAGE_MODE,
  FALLBACK_THEME_MODE,
  normalizeLanguageMode,
  normalizeThemeMode,
  resolveEffectiveLanguage,
  resolveEffectiveTheme,
} from "@/lib/preferences/modes";
import { readLocalPreferences, writeLocalPreferences } from "@/lib/preferences/storage";
import type {
  EffectiveTheme,
  LanguageMode,
  SupportedLanguage,
  ThemeMode,
  UserPreferences,
} from "@/types/preferences";

type PreferencesContextValue = {
  themeMode: ThemeMode;
  languageMode: LanguageMode;
  effectiveTheme: EffectiveTheme;
  effectiveLanguage: SupportedLanguage;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  setLanguageMode: (mode: LanguageMode) => Promise<void>;
  connectAuthenticatedPreferences: (preferences: UserPreferences) => Promise<void>;
  dictionary: ReturnType<typeof getDictionary>;
  syncError: string | null;
};

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

class PreferenceSyncError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
  }
}

async function patchAccountPreferences(payload: Partial<UserPreferences>) {
  const response = await fetch("/api/preferences", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const responseBody = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new PreferenceSyncError(
      responseBody?.error ?? "Unable to save preferences.",
      response.status,
    );
  }
}

export function PreferencesProvider({ children }: PropsWithChildren) {
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    const local = typeof window === "undefined" ? null : readLocalPreferences();
    return local?.themeMode ?? FALLBACK_THEME_MODE;
  });
  const [languageMode, setLanguageModeState] = useState<LanguageMode>(() => {
    const local = typeof window === "undefined" ? null : readLocalPreferences();
    return local?.languageMode ?? FALLBACK_LANGUAGE_MODE;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  const themeModeRef = useRef(themeMode);
  const languageModeRef = useRef(languageMode);

  useEffect(() => {
    themeModeRef.current = themeMode;
  }, [themeMode]);

  useEffect(() => {
    languageModeRef.current = languageMode;
  }, [languageMode]);

  const browserLanguages = useMemo(() => {
    if (typeof navigator === "undefined") return [];

    if (navigator.languages.length > 0) {
      return [...navigator.languages];
    }

    return navigator.language ? [navigator.language] : [];
  }, []);

  const effectiveTheme = useMemo(() => resolveEffectiveTheme(themeMode), [themeMode]);

  const effectiveLanguage = useMemo(
    () => resolveEffectiveLanguage(languageMode, browserLanguages),
    [languageMode, browserLanguages],
  );

  useEffect(() => {
    const rootElement = document.documentElement;
    rootElement.classList.toggle("dark", effectiveTheme === "dark");
    rootElement.dataset.theme = effectiveTheme;
  }, [effectiveTheme]);

  useEffect(() => {
    document.documentElement.lang = effectiveLanguage;
  }, [effectiveLanguage]);

  const writeToLocal = useCallback(
    (nextThemeMode: ThemeMode, nextLanguageMode: LanguageMode, pendingSync: boolean) => {
      writeLocalPreferences({
        themeMode: nextThemeMode,
        languageMode: nextLanguageMode,
        pendingSync,
        updatedAt: Date.now(),
      });
    },
    [],
  );

  const setThemeMode = useCallback(
    async (mode: ThemeMode) => {
      const nextMode = normalizeThemeMode(mode);
      const nextLanguageMode = languageModeRef.current;
      setThemeModeState(nextMode);
      setSyncError(null);

      if (!isAuthenticated) {
        writeToLocal(nextMode, nextLanguageMode, true);
        return;
      }

      try {
        await patchAccountPreferences({ themeMode: nextMode });
        writeToLocal(nextMode, nextLanguageMode, false);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to save preferences.";
        setSyncError(message);
        if (error instanceof PreferenceSyncError && error.status === 401) {
          setIsAuthenticated(false);
        }
        writeToLocal(nextMode, nextLanguageMode, true);
      }
    },
    [isAuthenticated, writeToLocal],
  );

  const setLanguageMode = useCallback(
    async (mode: LanguageMode) => {
      const nextMode = normalizeLanguageMode(mode);
      const nextThemeMode = themeModeRef.current;
      setLanguageModeState(nextMode);
      setSyncError(null);

      if (!isAuthenticated) {
        writeToLocal(nextThemeMode, nextMode, true);
        return;
      }

      try {
        await patchAccountPreferences({ languageMode: nextMode });
        writeToLocal(nextThemeMode, nextMode, false);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to save preferences.";
        setSyncError(message);
        if (error instanceof PreferenceSyncError && error.status === 401) {
          setIsAuthenticated(false);
        }
        writeToLocal(nextThemeMode, nextMode, true);
      }
    },
    [isAuthenticated, writeToLocal],
  );

  const connectAuthenticatedPreferences = useCallback(
    async (preferences: UserPreferences) => {
      const accountThemeMode = normalizeThemeMode(preferences.themeMode);
      const accountLanguageMode = normalizeLanguageMode(preferences.languageMode);
      setIsAuthenticated(true);
      setSyncError(null);

      const local = readLocalPreferences();
      const shouldSyncLocalToAccount = local?.pendingSync === true;

      if (shouldSyncLocalToAccount && local) {
        setThemeModeState(local.themeMode);
        setLanguageModeState(local.languageMode);

        try {
          await patchAccountPreferences({
            themeMode: local.themeMode,
            languageMode: local.languageMode,
          });
          writeToLocal(local.themeMode, local.languageMode, false);
          return;
        } catch (error) {
          if (error instanceof PreferenceSyncError && error.status === 401) {
            setIsAuthenticated(false);
          }
          setSyncError(error instanceof Error ? error.message : "Unable to sync guest preferences.");
          writeToLocal(local.themeMode, local.languageMode, true);
          return;
        }
      }

      setThemeModeState(accountThemeMode);
      setLanguageModeState(accountLanguageMode);
      writeToLocal(accountThemeMode, accountLanguageMode, false);
    },
    [writeToLocal],
  );

  const dictionary = useMemo(() => getDictionary(effectiveLanguage), [effectiveLanguage]);

  const contextValue = useMemo<PreferencesContextValue>(
    () => ({
      themeMode,
      languageMode,
      effectiveTheme,
      effectiveLanguage,
      setThemeMode,
      setLanguageMode,
      connectAuthenticatedPreferences,
      dictionary,
      syncError,
    }),
    [
      themeMode,
      languageMode,
      effectiveTheme,
      effectiveLanguage,
      setThemeMode,
      setLanguageMode,
      connectAuthenticatedPreferences,
      dictionary,
      syncError,
    ],
  );

  return <PreferencesContext.Provider value={contextValue}>{children}</PreferencesContext.Provider>;
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error("usePreferences must be used within PreferencesProvider.");
  }

  return context;
}
