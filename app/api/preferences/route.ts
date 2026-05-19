import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { isLanguageMode, isThemeMode } from "@/lib/preferences/modes";
import {
  getUserPreferences,
  updateUserPreferences,
} from "@/lib/data-access/user-preferences";

const updatePreferencesSchema = z
  .object({
    themeMode: z.string().optional(),
    languageMode: z.string().optional(),
  })
  .refine((input) => input.themeMode !== undefined || input.languageMode !== undefined, {
    message: "At least one preference must be provided.",
  });

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const preferences = await getUserPreferences({ userId: session.user.id });
  return NextResponse.json(preferences);
}

export async function PATCH(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsedBody = updatePreferencesSchema.safeParse(body);
  if (!parsedBody.success) {
    return NextResponse.json(
      { error: "Invalid preference payload.", details: parsedBody.error.flatten() },
      { status: 400 },
    );
  }

  const nextThemeMode = parsedBody.data.themeMode;
  const nextLanguageMode = parsedBody.data.languageMode;

  if (nextThemeMode !== undefined && !isThemeMode(nextThemeMode)) {
    return NextResponse.json({ error: "Invalid theme mode." }, { status: 400 });
  }

  if (nextLanguageMode !== undefined && !isLanguageMode(nextLanguageMode)) {
    return NextResponse.json({ error: "Invalid language mode." }, { status: 400 });
  }

  const updatedPreferences = await updateUserPreferences({
    userId: session.user.id,
    themeMode: nextThemeMode,
    languageMode: nextLanguageMode,
  });

  return NextResponse.json(updatedPreferences);
}
