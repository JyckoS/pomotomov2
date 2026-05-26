import { cn } from "@/lib/utils";

type UserAvatarProps = {
  name: string;
  avatarSrc: string | null;
  sizeClassName?: string;
};

export function UserAvatar({ name, avatarSrc, sizeClassName = "size-10" }: UserAvatarProps) {
  const fallback = name.trim().charAt(0).toUpperCase() || "?";

  return (
    <div
      className={cn(
        sizeClassName,
        "shrink-0 overflow-hidden rounded-full border border-[rgba(0,0,0,0.1)] bg-warm-white flex items-center justify-center text-sm font-semibold text-warm-gray-500 dark:border-[rgba(255,255,255,0.12)] dark:bg-[#23211f] dark:text-[#bbb6af]",
      )}
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
