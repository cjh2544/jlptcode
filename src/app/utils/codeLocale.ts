import type { Locale } from "@/i18n/config";

export type CodeValueLocale = {
  ja?: string | null;
  en?: string | null;
  cn?: string | null;
  my?: string | null;
};

const LOCALE_VALUE_KEY: Record<Locale, keyof CodeValueLocale | null> = {
  ko: null,
  ja: "ja",
  en: "en",
  cn: "cn",
  my: "my",
};

export function getLocalizedCodeValue(
  locale: Locale,
  valueLocale?: CodeValueLocale | null,
  fallback?: string | null,
): string {
  const key = LOCALE_VALUE_KEY[locale];
  if (key) {
    const localized = valueLocale?.[key];
    if (localized != null && String(localized).trim() !== "") {
      return String(localized);
    }
  }
  return (fallback || "").toString();
}
