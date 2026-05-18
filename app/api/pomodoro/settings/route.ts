import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { ensurePomodoroConfig, getPomodoroTimerTypeById, updatePomodoroSettings } from "@/lib/data-access/pomodoro";

const patchSettingsSchema = z
  .object({
    autoStartBreak: z.boolean().optional(),
    autoStartPomodoros: z.boolean().optional(),
    selectedTimerTypeId: z.string().uuid().nullable().optional(),
  })
  .refine(
    (payload) =>
      payload.autoStartBreak !== undefined ||
      payload.autoStartPomodoros !== undefined ||
      payload.selectedTimerTypeId !== undefined,
    {
      message: "At least one field is required.",
    },
  );

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const config = await ensurePomodoroConfig(session.user.id);
  return NextResponse.json({ settings: config.settings });
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

  const parsedBody = patchSettingsSchema.safeParse(body);
  if (!parsedBody.success) {
    return NextResponse.json(
      {
        error: "Invalid settings payload.",
        details: parsedBody.error.flatten(),
      },
      { status: 400 },
    );
  }

  if (parsedBody.data.selectedTimerTypeId !== undefined && parsedBody.data.selectedTimerTypeId !== null) {
    const selectedTimerType = await getPomodoroTimerTypeById({
      userId: session.user.id,
      timerTypeId: parsedBody.data.selectedTimerTypeId,
    });

    if (!selectedTimerType) {
      return NextResponse.json({ error: "Selected timer type was not found." }, { status: 404 });
    }
  }

  const settings = await updatePomodoroSettings({
    userId: session.user.id,
    autoStartBreak: parsedBody.data.autoStartBreak,
    autoStartPomodoros: parsedBody.data.autoStartPomodoros,
    selectedTimerTypeId: parsedBody.data.selectedTimerTypeId,
  });

  return NextResponse.json({ settings });
}
