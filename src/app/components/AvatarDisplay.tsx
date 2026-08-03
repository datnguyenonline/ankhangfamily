import { DefaultAvatar } from "@/app/assets/icons/DefaultAvatar";
import { getAvatar } from "@/lib/avatar/avatars";
import type { AvatarId } from "@/lib/avatar/types";

const sizeClasses = {
  sm: "h-9 w-9 text-lg",
  md: "h-11 w-11 text-xl",
  lg: "h-16 w-16 text-3xl",
  xl: "h-24 w-24 text-5xl",
  hero: "h-28 w-28 text-6xl sm:h-32 sm:w-32",
} as const;

type AvatarDisplayProps = {
  avatarId: AvatarId | null;
  size?: keyof typeof sizeClasses;
  className?: string;
  ring?: boolean;
};

export function AvatarDisplay({
  avatarId,
  size = "md",
  className = "",
  ring = false,
}: AvatarDisplayProps) {
  const sizeClass = sizeClasses[size];
  const ringClass = ring
    ? "ring-2 ring-green-500/40 ring-offset-2 ring-offset-theme-deep"
    : "";

  if (!avatarId) {
    return (
      <span
        className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-theme-elevated ${sizeClass} ${ringClass} ${className}`}
      >
        <DefaultAvatar />
      </span>
    );
  }

  const avatar = getAvatar(avatarId);

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${avatar.bg} shadow-lg shadow-black/20 ${sizeClass} ${ringClass} ${className}`}
    >
      <span aria-hidden>{avatar.emoji}</span>
    </span>
  );
}
