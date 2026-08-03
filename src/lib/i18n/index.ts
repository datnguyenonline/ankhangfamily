import { en } from "./dictionaries/en";
import { vi } from "./dictionaries/vi";
import type {
  Dictionary,
  Locale,
  TranslationValues,
  Translator,
} from "./types";
import { DEFAULT_LOCALE } from "./types";

const dictionaries: Record<Locale, Dictionary> = { vi, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries[DEFAULT_LOCALE];
}

function getNestedValue(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((current, key) => {
    if (current && typeof current === "object" && key in current) {
      return (current as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

function interpolate(template: string, values?: TranslationValues): string {
  if (!values) return template;
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    String(values[key] ?? `{${key}}`)
  );
}

export function createTranslator(locale: Locale): Translator {
  const dictionary = getDictionary(locale);

  return (key: string, values?: TranslationValues) => {
    const value = getNestedValue(dictionary, key);
    if (typeof value === "string") {
      return interpolate(value, values);
    }
    return key;
  };
}

export function pointsLabel(locale: Locale, points: number): string {
  const t = createTranslator(locale);
  return `+${points} ${t("common.points")}`;
}

export function gradeLabelText(locale: Locale, grade: number): string {
  return createTranslator(locale)("math.gradeLabel", { grade });
}

export * from "./types";
