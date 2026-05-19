import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { createPomodoroRecord } from "@/lib/data-access/pomodoro-record";

const createPomodoroRecordSchema = z.object({
  seconds: z.number().int().min(1).max(24 * 60 * 60),
});

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

  const parsedBody = createPomodoroRecordSchema.safeParse(body);
  if (!parsedBody.success) {
    return NextResponse.json(
      {
        error: "Invalid pomodoro record payload.",
      },
      { status: 400 },
    );
  }

  const record = await createPomodoroRecord({
    userId: session.user.id,
    seconds: parsedBody.data.seconds,
  });

  return NextResponse.json({ record }, { status: 201 });
}
