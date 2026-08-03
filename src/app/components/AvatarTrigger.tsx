"use client";

import { AvatarDisplay } from "@/app/components/AvatarDisplay";
import { useAvatar } from "@/lib/avatar/context";
import { useSettingsPopup } from "@/lib/settings/popup-context";
import { useTranslation } from "@/lib/i18n/context";

type AvatarTriggerProps = {
  transparent?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
};

export function AvatarTrigger({
  transparent = false,
  size = "sm",
  className = "",
}: AvatarTriggerProps) {
  const { avatarId } = useAvatar();
  const { open, toggle } = useSettingsPopup();
  const { t } = useTranslation();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-expanded={open}
      className={`flex items-center justify-center rounded-full transition-transform hover:scale-105 active:scale-95 ${
        transparent ? "ring-1 ring-white/20" : ""
      } ${className}`}
      aria-label={t("settings.open")}
    >
      <AvatarDisplay avatarId={avatarId} size={size} ring />
    </button>
  );
}
