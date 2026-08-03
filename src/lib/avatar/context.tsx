"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useSession } from "next-auth/react";
import { saveUserSettings } from "@/lib/settings/client";
import { isAvatarId } from "./avatars";
import {
  AVATAR_COOKIE,
  type AvatarId,
  type AvatarPrefs,
} from "./types";

type AvatarContextValue = {
  avatarId: AvatarId | null;
  setAvatarId: (id: AvatarId, options?: { persist?: boolean }) => void;
  clearAvatar: () => void;
  storageKey: string;
};

const AvatarContext = createContext<AvatarContextValue | null>(null);

export function readAvatarPrefs(): AvatarPrefs {
  if (typeof document === "undefined") return {};

  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${AVATAR_COOKIE}=`));

  if (!match) return {};

  try {
    const raw = decodeURIComponent(match.split("=")[1] ?? "");
    const parsed = JSON.parse(raw) as Record<string, number>;
    const prefs: AvatarPrefs = {};

    for (const [key, value] of Object.entries(parsed)) {
      if (isAvatarId(value)) {
        prefs[key] = value;
      }
    }

    return prefs;
  } catch {
    return {};
  }
}

function writePrefs(prefs: AvatarPrefs) {
  document.cookie = `${AVATAR_COOKIE}=${encodeURIComponent(JSON.stringify(prefs))}; path=/; max-age=31536000; SameSite=Lax`;
}

export function AvatarProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const storageKey = session?.user?.id ?? "guest";
  const userId = session?.user?.id;
  const [avatarId, setAvatarIdState] = useState<AvatarId | null>(null);

  useEffect(() => {
    const prefs = readAvatarPrefs();
    setAvatarIdState(prefs[storageKey] ?? null);
  }, [storageKey]);

  const setAvatarId = useCallback(
    (id: AvatarId, options?: { persist?: boolean }) => {
      const prefs = readAvatarPrefs();
      prefs[storageKey] = id;
      writePrefs(prefs);
      setAvatarIdState(id);

      if (options?.persist !== false && userId) {
        void saveUserSettings({ avatarId: id });
      }
    },
    [storageKey, userId]
  );

  const clearAvatar = useCallback(() => {
    const prefs = readAvatarPrefs();
    delete prefs[storageKey];
    writePrefs(prefs);
    setAvatarIdState(null);

    if (userId) {
      void saveUserSettings({ avatarId: null });
    }
  }, [storageKey, userId]);

  const value = useMemo(
    () => ({ avatarId, setAvatarId, clearAvatar, storageKey }),
    [avatarId, setAvatarId, clearAvatar, storageKey]
  );

  return (
    <AvatarContext.Provider value={value}>{children}</AvatarContext.Provider>
  );
}

export function useAvatar() {
  const context = useContext(AvatarContext);
  if (!context) {
    throw new Error("useAvatar must be used within AvatarProvider");
  }
  return context;
}
