import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { createTodoTask, getTodoTasksForUser } from "@/lib/data-access/todo";
import { DAILY_COLOR_PRESETS, DAILY_ICON_PRESETS } from "@/lib/daily/presets";

import { buildTodoDeadline, todoTaskMutationSchema } from "./_shared";

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const tasks = await getTodoTasksForUser({ userId: session.user.id });
  return NextResponse.json({ tasks });
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

  const parsedBody = todoTaskMutationSchema.safeParse(body);
  if (!parsedBody.success) {
    return NextResponse.json({ error: "Invalid task payload.", details: parsedBody.error.flatten() }, { status: 400 });
  }

  const colorPreset = DAILY_COLOR_PRESETS.find((preset) => preset.value === parsedBody.data.color);
  const iconPreset = DAILY_ICON_PRESETS.find((preset) => preset.name === parsedBody.data.iconName);

  if (!colorPreset || !iconPreset) {
    return NextResponse.json({ error: "Invalid preset selection." }, { status: 400 });
  }

  const createdTask = await createTodoTask({
    userId: session.user.id,
    parentId: parsedBody.data.parentId ?? null,
    title: parsedBody.data.title,
    notes: parsedBody.data.notes ?? null,
    color: colorPreset.value,
    iconName: iconPreset.name,
    deadline: buildTodoDeadline(parsedBody.data.deadlineDate, parsedBody.data.deadlineTime),
    isFinished: parsedBody.data.isFinished ?? false,
  });

  return NextResponse.json({ task: createdTask }, { status: 201 });
}
