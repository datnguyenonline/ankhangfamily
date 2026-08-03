"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { readAvatarPrefs } from "@/lib/avatar/context";
import { useAvatar } from "@/lib/avatar/context";
import { readLocaleCookie, useTranslation } from "@/lib/i18n/context";
import { readThemeCookie, useTheme } from "@/lib/theme/context";
import { fetchUserSettings, saveUserSettings } from "@/lib/settings/client";

export function UserSettingsSync() {
  const { data: session, status } = useSession();
  const { setTheme } = useTheme();
  const { setLocale } = useTranslation();
  const { setAvatarId } = useAvatar();
  const syncedUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    const userId = session?.user?.id;

    if (status !== "authenticated" || !userId) {
      syncedUserIdRef.current = null;
      return;
    }

    if (syncedUserIdRef.current === userId) return;

    let cancelled = false;

    async function syncSettings() {
      const settings = await fetchUserSettings();
      if (cancelled || !settings || !userId) return;

      if (settings.saved) {
        setTheme(settings.theme, { persist: false });
        setLocale(settings.locale, { persist: false });
        if (settings.avatarId) {
          setAvatarId(settings.avatarId, { persist: false });
        }
      } else {
        const prefs = readAvatarPrefs();
        const guestAvatar = prefs.guest ?? null;

        await saveUserSettings({
          theme: readThemeCookie(),
          locale: readLocaleCookie(),
          avatarId: guestAvatar,
        });

        if (guestAvatar) {
          setAvatarId(guestAvatar, { persist: false });
        }
      }

      syncedUserIdRef.current = userId;
    }

    void syncSettings();

    return () => {
      cancelled = true;
    };
  }, [session?.user?.id, setAvatarId, setLocale, setTheme, status]);

  return null;
}
