"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { saveUserSettings } from "@/lib/settings/client";
import {
  createTranslator,
  getDictionary,
  type Dictionary,
  type Locale,
  LOCALE_COOKIE,
  DEFAULT_LOCALE,
  type Translator,
} from "@/lib/i18n";

type LanguageContextValue = {
  locale: Locale;
  dictionary: Dictionary;
  t: Translator;
  setLocale: (locale: Locale, options?: { persist?: boolean }) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function readLocaleCookie(): Locale {
  if (typeof document === "undefined") return DEFAULT_LOCALE;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${LOCALE_COOKIE}=`));
  const value = match?.split("=")[1];
  return value === "en" ? "en" : DEFAULT_LOCALE;
}

function writeLocaleCookie(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; SameSite=Lax`;
}

export function LanguageProvider({
  children,
  initialLocale = DEFAULT_LOCALE,
}: {
  children: React.ReactNode;
  initialLocale?: Locale;
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  useEffect(() => {
    setLocaleState(readLocaleCookie());
  }, []);

  const setLocale = useCallback(
    (next: Locale, options?: { persist?: boolean }) => {
      writeLocaleCookie(next);
      setLocaleState(next);
      router.refresh();

      if (options?.persist !== false && userId) {
        void saveUserSettings({ locale: next });
      }
    },
    [router, userId]
  );

  const dictionary = useMemo(() => getDictionary(locale), [locale]);
  const t = useMemo(() => createTranslator(locale), [locale]);

  const value = useMemo(
    () => ({ locale, dictionary, t, setLocale }),
    [locale, dictionary, t, setLocale]
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useTranslation must be used within LanguageProvider");
  }
  return context;
}

export function useOptionalTranslation() {
  return useContext(LanguageContext);
}
