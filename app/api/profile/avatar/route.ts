import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { get } from "@vercel/blob";

import { auth } from "@/lib/auth";
import { uploadAvatarFile, validateAvatarFile } from "@/lib/data-access/avatar-storage";
import { updateUserProfileImage } from "@/lib/data-access/user-profile";

export const runtime = "nodejs";

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (!session.user.image) {
    return NextResponse.json({ error: "Avatar not found." }, { status: 404 });
  }

  const storedReference = session.user.image;
  if (storedReference.startsWith("http://") || storedReference.startsWith("https://")) {
    return NextResponse.redirect(storedReference);
  }

  const blobResult = await get(storedReference, {
    access: "private",
  });

  if (!blobResult || blobResult.statusCode !== 200) {
    return NextResponse.json({ error: "Avatar not found." }, { status: 404 });
  }

  return new NextResponse(blobResult.stream, {
    headers: {
      "Content-Type": blobResult.blob.contentType,
      "Cache-Control": "private, no-store",
    },
  });
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("avatar");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Avatar file is required." }, { status: 400 });
  }

  const validationError = validateAvatarFile(file);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const imagePathname = await uploadAvatarFile({
    file,
    userId: session.user.id,
  });

  await updateUserProfileImage({
    userId: session.user.id,
    imageUrl: imagePathname,
  });

  return NextResponse.json({
    imageUrl: `/api/profile/avatar?v=${Date.now()}`,
  });
}
