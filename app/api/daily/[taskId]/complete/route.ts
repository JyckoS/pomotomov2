import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { toggleDailyTaskCompletion } from "@/lib/data-access/daily";

const completionPayloadSchema = z.object({
  day: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export async function POST(request: Request, { params }: { params: Promise<{ taskId: string }> }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { taskId } = await params;
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsedBody = completionPayloadSchema.safeParse(body);
  if (!parsedBody.success) {
    return NextResponse.json({ error: "Invalid completion payload." }, { status: 400 });
  }

  const result = await toggleDailyTaskCompletion({
    userId: session.user.id,
    taskId,
    day: parsedBody.data.day,
  });

  return NextResponse.json(result);
}
