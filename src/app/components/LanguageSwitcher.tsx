"use client";

import { useTranslation } from "@/lib/i18n/context";
import type { Locale } from "@/lib/i18n";
import { SegmentedControl } from "@/app/components/ui/SegmentedControl";

const options: { locale: Locale; label: string }[] = [
  { locale: "vi", label: "VI" },
  { locale: "en", label: "EN" },
];

export function LanguageSwitcher({ transparent = false }: { transparent?: boolean }) {
  const { locale, setLocale } = useTranslation();

  return (
    <SegmentedControl
      transparent={transparent}
      value={locale}
      onChange={setLocale}
      options={options.map((option) => ({
        value: option.locale,
        label: option.label,
        ariaLabel: option.locale === "vi" ? "Tiếng Việt" : "English",
      }))}
    />
  );
}
