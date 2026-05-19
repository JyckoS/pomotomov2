import "server-only";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { user } from "@/db/schema";
import {
  normalizeLanguageMode,
  normalizeThemeMode,
} from "@/lib/preferences/modes";
import type { LanguageMode, ThemeMode, UserPreferences } from "@/types/preferences";

const preferencesSelection = {
  themeMode: user.themeMode,
  languageMode: user.languageMode,
};

export async function getUserPreferences({ userId }: { userId: string }): Promise<UserPreferences> {
  const [result] = await db
    .select(preferencesSelection)
    .from(user)
    .where(eq(user.id, userId))
    .limit(1);

  return {
    themeMode: normalizeThemeMode(result?.themeMode),
    languageMode: normalizeLanguageMode(result?.languageMode),
  };
}

export async function updateUserPreferences({
  userId,
  themeMode,
  languageMode,
}: {
  userId: string;
  themeMode?: ThemeMode;
  languageMode?: LanguageMode;
}) {
  const [updated] = await db
    .update(user)
    .set({
      ...(themeMode ? { themeMode } : {}),
      ...(languageMode ? { languageMode } : {}),
      updatedAt: new Date(),
    })
    .where(eq(user.id, userId))
    .returning(preferencesSelection);

  return {
    themeMode: normalizeThemeMode(updated?.themeMode),
    languageMode: normalizeLanguageMode(updated?.languageMode),
  };
}
