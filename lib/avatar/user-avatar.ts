export function getUserAvatarSrc(userId: string, image: string | null) {
  if (!image) return null;
  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  return `/api/users/${userId}/avatar`;
}
