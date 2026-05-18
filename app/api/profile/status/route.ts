import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { updateUserStatus } from "@/lib/data-access/user-profile";
import { DEFAULT_USER_STATUS, MAX_USER_STATUS_LENGTH } from "@/lib/user-status";

const updateStatusSchema = z.object({
  status: z.string().max(MAX_USER_STATUS_LENGTH),
});

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

  const parsedBody = updateStatusSchema.safeParse(body);
  if (!parsedBody.success) {
    return NextResponse.json(
      {
        error: "Invalid status payload.",
        details: parsedBody.error.flatten(),
      },
      { status: 400 },
    );
  }

  const normalizedStatus = parsedBody.data.status.trim() || DEFAULT_USER_STATUS;

  await updateUserStatus({
    userId: session.user.id,
    status: normalizedStatus,
  });

  return NextResponse.json({ status: normalizedStatus });
}
