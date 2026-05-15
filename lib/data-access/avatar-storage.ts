import "server-only";

import { put } from "@vercel/blob";

const MAX_AVATAR_BYTES = 2 * 1024 * 1024;
const ALLOWED_AVATAR_MIME_TYPES = new Set(["image/webp", "image/jpeg", "image/png"]);

export function validateAvatarFile(file: File): string | null {
  if (!ALLOWED_AVATAR_MIME_TYPES.has(file.type)) {
    return "Please upload a JPG, PNG, or WEBP image.";
  }

  if (file.size > MAX_AVATAR_BYTES) {
    return "Avatar image must be 2MB or smaller.";
  }

  return null;
}

export async function uploadAvatarFile({
  file,
  userId,
}: {
  file: File;
  userId: string;
}): Promise<string> {
  const safeUserId = userId.replace(/[^a-zA-Z0-9_-]/g, "");
  const fileName = `avatars/${safeUserId}-${Date.now()}.webp`;

  const uploadedBlob = await put(fileName, file, {
    access: "private",
    addRandomSuffix: true,
  });

  return uploadedBlob.pathname;
}
