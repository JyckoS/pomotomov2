type UserAvatarProps = {
  name: string;
  avatarSrc: string | null;
  sizeClassName?: string;
};

export function UserAvatar({ name, avatarSrc, sizeClassName = "size-10" }: UserAvatarProps) {
  const fallback = name.trim().charAt(0).toUpperCase() || "?";

  return (
    <div
      className={`${sizeClassName} shrink-0 overflow-hidden rounded-full border border-[rgba(0,0,0,0.1)] bg-[#f6f5f4] flex items-center justify-center text-sm font-semibold text-[#615d59]`}
    >
      {avatarSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={avatarSrc} alt={`${name} avatar`} className="size-full object-cover" />
      ) : (
        <span>{fallback}</span>
      )}
    </div>
  );
}
