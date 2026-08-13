export const LOCALES = ["ko", "ja", "en", "cn", "my"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "ko";
export const LOCALE_COOKIE = "jlptcode-locale";

export const LOCALE_LABELS: Record<Locale, string> = {
  ko: "한국어",
  ja: "日本語",
  en: "English",
  cn: "中文",
  my: "မြန်မာ",
};

const LOCALE_ALIASES: Record<string, Locale> = {
  zh: "cn",
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function parseLocale(value: string | null | undefined): Locale | null {
  if (!value) return null;
  if (isLocale(value)) return value;
  return LOCALE_ALIASES[value] ?? null;
}
