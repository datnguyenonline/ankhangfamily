"use client";

import { AVATARS } from "@/lib/avatar/avatars";
import type { AvatarId } from "@/lib/avatar/types";
import { AvatarDisplay } from "@/app/components/AvatarDisplay";

type AvatarPickerProps = {
  value: AvatarId | null;
  onChange: (id: AvatarId) => void;
};

export function AvatarPicker({ value, onChange }: AvatarPickerProps) {
  return (
    <div className="grid grid-cols-4 gap-3 min-[400px]:grid-cols-5 sm:grid-cols-5">
      {AVATARS.map((avatar) => {
        const selected = value === avatar.id;

        return (
          <button
            key={avatar.id}
            type="button"
            onClick={() => onChange(avatar.id)}
            className={`flex min-h-14 min-w-14 items-center justify-center rounded-xl border p-1 transition-all touch-manipulation ${
              selected
                ? "border-green-500 bg-green-950/40 ring-2 ring-green-500/30"
                : "border-green-900/30 bg-theme-surface hover:border-green-700/50 hover:bg-theme-elevated"
            }`}
            aria-pressed={selected}
            aria-label={avatar.emoji}
          >
            <AvatarDisplay avatarId={avatar.id} size="md" />
          </button>
        );
      })}
    </div>
  );
}
