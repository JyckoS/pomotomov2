import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth";
import {
  deleteDailyTask,
  updateDailyTask,
} from "@/lib/data-access/daily";
import {
  DAILY_COLOR_PRESETS,
  DAILY_ICON_PRESETS,
} from "@/lib/daily/presets";

const updateDailyTaskSchema = z.object({
  title: z.string().trim().min(1).max(120),
  parentId: z.preprocess(
    (value) => (value === "" ? null : value),
    z.string().uuid().nullable().optional(),
  ),
  notes: z.preprocess(
    (value) => (value === "" ? null : value),
    z.string().trim().max(500).nullable().optional(),
  ),
  color: z.string().trim(),
  iconName: z.string().trim(),
  toCompleteBefore: z.preprocess(
    (value) => (value === "" ? null : value),
    z.string().regex(/^\d{2}:\d{2}$/).nullable().optional(),
  ),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ taskId: string }> }) {
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

  const parsedBody = updateDailyTaskSchema.safeParse(body);
  if (!parsedBody.success) {
    return NextResponse.json({ error: "Invalid task payload.", details: parsedBody.error.flatten() }, { status: 400 });
  }

  const colorPreset = DAILY_COLOR_PRESETS.find((preset) => preset.value === parsedBody.data.color);
  const iconPreset = DAILY_ICON_PRESETS.find((preset) => preset.name === parsedBody.data.iconName);

  if (!colorPreset || !iconPreset) {
    return NextResponse.json({ error: "Invalid preset selection." }, { status: 400 });
  }

  const updatedTask = await updateDailyTask({
    userId: session.user.id,
    taskId,
    parentId: parsedBody.data.parentId ?? null,
    title: parsedBody.data.title,
    notes: parsedBody.data.notes ?? null,
    color: colorPreset.value,
    iconName: iconPreset.name,
    toCompleteBefore: parsedBody.data.toCompleteBefore ?? null,
  });

  return NextResponse.json({ task: updatedTask });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ taskId: string }> }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { taskId } = await params;
  await deleteDailyTask({ userId: session.user.id, taskId });

  return NextResponse.json({ success: true });
}
