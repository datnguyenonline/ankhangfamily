"use client";

import { useTranslation } from "@/lib/i18n/context";
import { useTheme } from "@/lib/theme/context";
import { THEMES, type ThemeId } from "@/lib/theme/types";
import { getThemeConfig } from "@/lib/theme/themes";

export function ThemeSwitcher({ transparent = false }: { transparent?: boolean }) {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <div
      className={`flex rounded-lg border p-0.5 ${
        transparent
          ? "border-white/20 bg-white/10"
          : "border-green-800/50 bg-green-950/40"
      }`}
      role="group"
      aria-label={t("theme.label")}
    >
      {THEMES.map((id: ThemeId) => {
        const config = getThemeConfig(id);
        const active = theme === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => setTheme(id)}
            title={t(`theme.${id}`)}
            className={`rounded-md px-2 py-1 text-sm transition-colors ${
              active
                ? transparent
                  ? "bg-white text-black"
                  : "bg-green-600 text-black"
                : transparent
                  ? "text-white/70 hover:text-white"
                  : "text-green-400/70 hover:text-green-300"
            }`}
            aria-label={t(`theme.${id}`)}
            aria-pressed={active}
          >
            {config.emoji}
          </button>
        );
      })}
    </div>
  );
}
