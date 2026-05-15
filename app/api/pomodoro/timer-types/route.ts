import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { createPomodoroTimerType, ensurePomodoroConfig } from "@/lib/data-access/pomodoro";

const createTimerTypeSchema = z.object({
  name: z.string().trim().min(1).max(80),
  focusDurationMinutes: z.number().int().min(1).max(240),
  breakDurationMinutes: z.number().int().min(1).max(120),
});

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const config = await ensurePomodoroConfig(session.user.id);
  return NextResponse.json({ timerTypes: config.timerTypes });
}

export async function POST(request: Request) {
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

  const parsedBody = createTimerTypeSchema.safeParse(body);
  if (!parsedBody.success) {
    return NextResponse.json(
      {
        error: "Invalid timer type payload.",
        details: parsedBody.error.flatten(),
      },
      { status: 400 },
    );
  }

  const timerType = await createPomodoroTimerType({
    userId: session.user.id,
    name: parsedBody.data.name,
    focusDurationMinutes: parsedBody.data.focusDurationMinutes,
    breakDurationMinutes: parsedBody.data.breakDurationMinutes,
  });

  return NextResponse.json({ timerType }, { status: 201 });
}
