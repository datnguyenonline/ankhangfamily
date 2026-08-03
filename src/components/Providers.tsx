"use client";

import { SessionProvider } from "next-auth/react";
import { LanguageProvider } from "@/lib/i18n/context";
import type { Locale } from "@/lib/i18n";

export function Providers({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: Locale;
}) {
  return (
    <SessionProvider>
      <LanguageProvider initialLocale={locale}>{children}</LanguageProvider>
    </SessionProvider>
  );
}
