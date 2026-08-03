"use client";

import { useTranslation } from "@/lib/i18n/context";
import { useTheme } from "@/lib/theme/context";
import { THEMES, type ThemeId } from "@/lib/theme/types";
import { getThemeConfig } from "@/lib/theme/themes";
import { SegmentedControl } from "@/app/components/ui/SegmentedControl";

export function ThemeSwitcher({ transparent = false }: { transparent?: boolean }) {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <SegmentedControl
      transparent={transparent}
      value={theme}
      onChange={setTheme}
      groupLabel={t("theme.label")}
      options={THEMES.map((id: ThemeId) => ({
        value: id,
        label: getThemeConfig(id).emoji,
        ariaLabel: t(`theme.${id}`),
      }))}
    />
  );
}
