import { prisma } from "@/app/lib/prisma";
import { createModel } from "@/app/lib/create-model";
import { flattenLocale, localeFromFlat } from "@/app/lib/content-shape";
import { newId } from "@/app/lib/new-id";

type AnyRecord = Record<string, any>;

function wordLocaleFromDoc(doc: AnyRecord) {
  const row = doc.wordLocale;
  if (!row || typeof row !== "object") return null;
  const ko = row.ko ?? null;
  const en = row.en ?? null;
  const cn = row.cn ?? null;
  const my = row.my ?? null;
  if (ko == null && en == null && cn == null && my == null) return null;
  return { ko, en, cn, my };
}

async function syncWordLocale(id: string, data: AnyRecord) {
  if (data.word_locale === undefined && data.wordLocale === undefined) return;
  const locale = (data.word_locale ?? data.wordLocale ?? {}) as AnyRecord;
  await prisma.todaySpeakWord.deleteMany({ where: { parentId: id } });
  if (!locale || typeof locale !== "object") return;
  if (!locale.ko && !locale.en && !locale.cn && !locale.my) return;
  await prisma.todaySpeakWord.create({
    data: {
      id: newId(),
      parentId: id,
      ko: locale.ko ?? null,
      en: locale.en ?? null,
      cn: locale.cn ?? null,
      my: locale.my ?? null,
    },
  });
}

const TodaySpeak = createModel({
  collection: "today_speak",
  prisma: prisma.todaySpeak,
  allowedFields: [
    "id",
    "sortNo",
    "sentence",
    "sentence_read",
    "sentence_translate",
    "sentenceLocaleEn",
    "sentenceLocaleCn",
    "sentenceLocaleMy",
    "keyword",
    "speaker",
    "image",
  ],
  include: { wordLocale: true },
  transformRead: (doc) => {
    const word_locale = wordLocaleFromDoc(doc);
    const { wordLocale, ...rest } = doc;
    return {
      ...rest,
      sentence_locale: localeFromFlat(doc, "sentence"),
      word_locale,
      word: word_locale?.ko ?? null,
    };
  },
  transformWrite: (data) => {
    const next = { ...data };
    if (data.sentence_locale !== undefined) {
      Object.assign(next, flattenLocale(data.sentence_locale, "sentence"));
    }
    delete next.word;
    delete next.word_locale;
    delete next.wordLocale;
    return next;
  },
  syncRelated: (id, data) => syncWordLocale(id, data),
});

export default TodaySpeak;
