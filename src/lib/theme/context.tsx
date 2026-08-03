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
import { getThemeConfig } from "./themes";
import {
  DEFAULT_THEME,
  THEME_COOKIE,
  type ThemeConfig,
  type ThemeId,
} from "./types";

type ThemeContextValue = {
  theme: ThemeId;
  themeConfig: ThemeConfig;
  setTheme: (theme: ThemeId, options?: { persist?: boolean }) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function readThemeCookie(): ThemeId {
  if (typeof document === "undefined") return DEFAULT_THEME;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${THEME_COOKIE}=`));
  const value = match?.split("=")[1];
  if (value === "forest" || value === "mountain" || value === "beach") {
    return value;
  }
  return DEFAULT_THEME;
}

function writeThemeCookie(theme: ThemeId) {
  document.cookie = `${THEME_COOKIE}=${theme}; path=/; max-age=31536000; SameSite=Lax`;
}

function applyTheme(theme: ThemeId) {
  document.documentElement.dataset.theme = theme;
}

export function ThemeProvider({
  children,
  initialTheme = DEFAULT_THEME,
}: {
  children: React.ReactNode;
  initialTheme?: ThemeId;
}) {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [theme, setThemeState] = useState<ThemeId>(initialTheme);

  useEffect(() => {
    const saved = readThemeCookie();
    setThemeState(saved);
    applyTheme(saved);
  }, []);

  const setTheme = useCallback(
    (next: ThemeId, options?: { persist?: boolean }) => {
      writeThemeCookie(next);
      setThemeState(next);
      applyTheme(next);

      if (options?.persist !== false && userId) {
        void saveUserSettings({ theme: next });
      }
    },
    [userId]
  );

  const themeConfig = useMemo(() => getThemeConfig(theme), [theme]);

  const value = useMemo(
    () => ({ theme, themeConfig, setTheme }),
    [theme, themeConfig, setTheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
