import { isAvatarId } from "@/lib/avatar/avatars";
import { LOCALES } from "@/lib/i18n/types";
import { THEMES } from "@/lib/theme/types";
import type { UserSettingsPatch } from "./types";

export function parseUserSettingsPatch(body: unknown): UserSettingsPatch | null {
  if (!body || typeof body !== "object") return null;

  const patch: UserSettingsPatch = {};
  const data = body as Record<string, unknown>;

  if ("avatarId" in data) {
    if (data.avatarId === null) {
      patch.avatarId = null;
    } else if (typeof data.avatarId === "number" && isAvatarId(data.avatarId)) {
      patch.avatarId = data.avatarId;
    } else {
      return null;
    }
  }

  if ("theme" in data) {
    if (typeof data.theme === "string" && THEMES.includes(data.theme as (typeof THEMES)[number])) {
      patch.theme = data.theme as UserSettingsPatch["theme"];
    } else {
      return null;
    }
  }

  if ("locale" in data) {
    if (typeof data.locale === "string" && LOCALES.includes(data.locale as (typeof LOCALES)[number])) {
      patch.locale = data.locale as UserSettingsPatch["locale"];
    } else {
      return null;
    }
  }

  if (Object.keys(patch).length === 0) return null;
  return patch;
}
