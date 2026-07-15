"use client";

import {
  DEFAULT_LOCALE,
  isLocale,
  LOCALE_COOKIE,
  type Locale,
} from "@/i18n/config";
import { getMessages, type Messages } from "@/i18n/getMessages";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type I18nContextValue = {
  locale: Locale;
  messages: Messages;
  setLocale: (locale: Locale) => void;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function readStoredLocale(): Locale {
  if (typeof document === "undefined") return DEFAULT_LOCALE;

  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${LOCALE_COOKIE}=`));
  const fromCookie = match?.split("=")[1];
  if (fromCookie && isLocale(fromCookie)) return fromCookie;

  try {
    const fromStorage = localStorage.getItem(LOCALE_COOKIE);
    if (fromStorage && isLocale(fromStorage)) return fromStorage;
  } catch {
    /* ignore */
  }

  return DEFAULT_LOCALE;
}

function persistLocale(locale: Locale) {
  document.documentElement.lang = locale;
  try {
    localStorage.setItem(LOCALE_COOKIE, locale);
  } catch {
    /* ignore */
  }
  document.cookie = `${LOCALE_COOKIE}=${locale};path=/;max-age=31536000;SameSite=Lax`;
}

function getNestedMessage(obj: Record<string, unknown>, path: string): string {
  const value = path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in (acc as object)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);

  return typeof value === "string" ? value : path;
}

export default function I18nProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = readStoredLocale();
    setLocaleState(stored);
    persistLocale(stored);
    setReady(true);
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    persistLocale(next);
  }, []);

  const messages = useMemo(() => getMessages(locale), [locale]);

  const value = useMemo(
    () => ({ locale, messages, setLocale }),
    [locale, messages, setLocale],
  );

  if (!ready) {
    return (
      <I18nContext.Provider
        value={{
          locale: DEFAULT_LOCALE,
          messages: getMessages(DEFAULT_LOCALE),
          setLocale,
        }}
      >
        {children}
      </I18nContext.Provider>
    );
  }

  return (
    <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return ctx;
}

export function useTranslations() {
  const { messages, locale, setLocale } = useI18n();

  const t = useCallback(
    (key: string) =>
      getNestedMessage(messages as unknown as Record<string, unknown>, key),
    [messages],
  );

  return { t, locale, setLocale };
}
