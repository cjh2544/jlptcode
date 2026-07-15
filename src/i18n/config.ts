export const LOCALES = ["ko", "ja", "en", "zh", "my"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "ko";
export const LOCALE_COOKIE = "jlptcode-locale";

export const LOCALE_LABELS: Record<Locale, string> = {
  ko: "한국어",
  ja: "日本語",
  en: "English",
  zh: "中文",
  my: "မြန်မာ",
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}
