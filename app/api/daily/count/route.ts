import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { getDailyIncompleteCount } from "@/lib/data-access/daily";

export async function GET(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const url = new URL(request.url);
  const day = url.searchParams.get("day");

  if (!day || !/^\d{4}-\d{2}-\d{2}$/.test(day)) {
    return NextResponse.json({ error: "Invalid day." }, { status: 400 });
  }

  const totalIncomplete = await getDailyIncompleteCount({ userId: session.user.id, day });
  return NextResponse.json({ totalIncomplete });
}
