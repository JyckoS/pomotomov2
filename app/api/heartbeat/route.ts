import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { touchUserHeartbeat } from "@/lib/data-access/heart-beat";

const heartbeatSchema = z.object({
  source: z.string().trim().min(1).max(40).optional(),
});

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    await touchUserHeartbeat({ userId: session.user.id });
    return new NextResponse(null, { status: 204 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsedBody = heartbeatSchema.safeParse(body);
  if (!parsedBody.success) {
    return NextResponse.json(
      {
        error: "Invalid heartbeat payload.",
        details: parsedBody.error.flatten(),
      },
      { status: 400 },
    );
  }

  await touchUserHeartbeat({
    userId: session.user.id,
    source: parsedBody.data.source,
  });

  return new NextResponse(null, { status: 204 });
}
