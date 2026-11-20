import type { Locale } from "@/i18n/config";

export type SentenceLocale = {
  en?: string;
  cn?: string;
  my?: string;
};

export type WordLocale = {
  ko?: string | null;
  en?: string | null;
  cn?: string | null;
  my?: string | null;
};

const LOCALE_TRANSLATE_KEY: Record<Locale, keyof SentenceLocale | null> = {
  ko: null,
  ja: "en",
  en: "en",
  cn: "cn",
  my: "my",
};

const WORD_LOCALE_KEY: Record<Locale, keyof WordLocale> = {
  ko: "ko",
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

export function getLocalizedWord(
  locale: Locale,
  wordLocale?: WordLocale | null,
  fallback?: string | null,
): string {
  const key = WORD_LOCALE_KEY[locale];
  return (wordLocale?.[key] || wordLocale?.ko || fallback || "").toString();
}
