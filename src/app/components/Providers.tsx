"use client";

import { SessionProvider } from "next-auth/react";
import { LanguageProvider } from "@/lib/i18n/context";
import { ThemeProvider } from "@/lib/theme/context";
import { AvatarProvider } from "@/lib/avatar/context";
import { UserSettingsSync } from "@/lib/settings/UserSettingsSync";
import type { Locale } from "@/lib/i18n";
import type { ThemeId } from "@/lib/theme";

export function Providers({
  children,
  locale,
  theme,
}: {
  children: React.ReactNode;
  locale: Locale;
  theme: ThemeId;
}) {
  return (
    <SessionProvider>
      <ThemeProvider initialTheme={theme}>
        <LanguageProvider initialLocale={locale}>
          <AvatarProvider>
            <UserSettingsSync />
            {children}
          </AvatarProvider>
        </LanguageProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
