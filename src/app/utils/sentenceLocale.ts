import type { Locale } from "@/i18n/config";

export type SentenceLocale = {
  en?: string;
  cn?: string;
  my?: string;
};

const LOCALE_TRANSLATE_KEY: Record<Locale, keyof SentenceLocale | null> = {
  ko: null,
  ja: "en",
  en: "en",
  cn: "cn",
  my: "my",
};

export function getLocalizedTranslate(
  locale: Locale,
  sentenceLocale?: SentenceLocale | null,
  fallback?: string | null,
): string {
  const key = LOCALE_TRANSLATE_KEY[locale];
  if (key) {
    return (sentenceLocale?.[key] || fallback || "").toString();
  }
  return (fallback || "").toString();
}
