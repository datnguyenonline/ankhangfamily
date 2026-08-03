"use client";

import { useTranslation } from "@/lib/i18n/context";
import type { Locale } from "@/lib/i18n";

const options: { locale: Locale; label: string }[] = [
  { locale: "vi", label: "VI" },
  { locale: "en", label: "EN" },
];

export function LanguageSwitcher({ transparent = false }: { transparent?: boolean }) {
  const { locale, setLocale } = useTranslation();

  return (
    <div
      className={`flex rounded-lg border p-0.5 ${
        transparent
          ? "border-white/20 bg-white/10"
          : "border-green-800/50 bg-green-950/40"
      }`}
    >
      {options.map((option) => (
        <button
          key={option.locale}
          type="button"
          onClick={() => setLocale(option.locale)}
          className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
            locale === option.locale
              ? transparent
                ? "bg-white text-black"
                : "bg-green-600 text-black"
              : transparent
                ? "text-white/70 hover:text-white"
                : "text-green-400/70 hover:text-green-300"
          }`}
          aria-label={option.locale === "vi" ? "Tiếng Việt" : "English"}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
