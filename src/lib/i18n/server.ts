import { cookies } from "next/headers";
import {
  createTranslator,
  getDictionary,
  type Locale,
  LOCALE_COOKIE,
  DEFAULT_LOCALE,
} from "./index";

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const value = cookieStore.get(LOCALE_COOKIE)?.value;
  return value === "en" ? "en" : DEFAULT_LOCALE;
}

export async function getServerTranslation() {
  const locale = await getLocale();
  const dictionary = getDictionary(locale);
  const t = createTranslator(locale);
  return { locale, dictionary, t };
}
