import type { AvatarId } from "@/lib/avatar/types";
import type { Locale } from "@/lib/i18n";
import type { ThemeId } from "@/lib/theme";

export type UserSettings = {
  avatarId: AvatarId | null;
  theme: ThemeId;
  locale: Locale;
  saved: boolean;
};

export type UserSettingsPatch = {
  avatarId?: AvatarId | null;
  theme?: ThemeId;
  locale?: Locale;
};

export type StoredUserSettings = {
  avatarId: AvatarId | null;
  theme: ThemeId;
  locale: Locale;
  updatedAt: string;
};

export type SettingsMap = Record<string, StoredUserSettings>;
