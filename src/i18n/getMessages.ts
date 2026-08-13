import type { Locale } from "./config";
import ko from "./messages/ko.json";
import ja from "./messages/ja.json";
import en from "./messages/en.json";
import cn from "./messages/cn.json";
import my from "./messages/my.json";

export type Messages = typeof ko;

const messagesByLocale: Record<Locale, Messages> = {
  ko,
  ja,
  en,
  cn,
  my,
};

export function getMessages(locale: Locale): Messages {
  return messagesByLocale[locale];
}
