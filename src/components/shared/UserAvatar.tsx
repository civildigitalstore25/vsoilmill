import { cn } from "@/lib/utils/cn";
import type { UserAvatarProps } from "@/types/user";

export function UserAvatar({ image, name, className }: UserAvatarProps) {
  if (image) {
    return (
      <img
        src={image}
        alt={name}
        referrerPolicy="no-referrer"
        className={cn("h-9 w-9 rounded-full object-cover", className)}
      />
    );
  }

  return (
    <span
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary",
        className,
      )}
    >
      {name.slice(0, 1).toUpperCase()}
    </span>
  );
}
