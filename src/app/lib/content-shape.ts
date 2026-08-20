import { newId } from "./new-id";

type AnyRecord = Record<string, any>;

export const EXAM_INCLUDE = { choices: { orderBy: { no: "asc" as const } } };
export const TODAY_INCLUDE = { questionChoices: { orderBy: { sort: "asc" as const } } };
export const WORD_INCLUDE = {
  means: { orderBy: { sort: "asc" as const } },
  parts: { orderBy: { sort: "asc" as const } },
};
export const USER_INCLUDE = { roles: { orderBy: { sort: "asc" as const } } };
export const CODE_DETAIL_INCLUDE = { levels: { orderBy: { sort: "asc" as const } } };

const EXAM_FLAT_FIELDS = [
  "questionContent",
  "questionContentOrg",
  "questionAudioLink",
  "questionAudioName",
  "questionImageLink",
  "questionImageName",
  "sentenceTranslation",
  "sentenceReading",
  "sentenceEn",
  "sentenceCn",
  "sentenceLocaleEn",
  "sentenceLocaleCn",
  "sentenceLocaleMy",
  "wordLocaleEn",
  "wordLocaleCn",
  "wordLocaleMy",
  "questionText",
  "questionAnswer",
  "questionChoices",
];

export function asText(value: unknown): string | null {
  if (value == null || value === "") return null;
  return String(value);
}

export function flattenLocale(locale: unknown, prefix: "sentence" | "word") {
  const obj = locale && typeof locale === "object" ? (locale as AnyRecord) : {};
  return {
    [`${prefix}LocaleEn`]: asText(obj.en),
    [`${prefix}LocaleCn`]: asText(obj.cn),
    [`${prefix}LocaleMy`]: asText(obj.my),
  };
}

export function localeFromFlat(doc: AnyRecord, prefix: "sentence" | "word") {
  const en = doc[`${prefix}LocaleEn`] ?? null;
  const cn = doc[`${prefix}LocaleCn`] ?? null;
  const my = doc[`${prefix}LocaleMy`] ?? null;
  if (en == null && cn == null && my == null) return null;
  return { en, cn, my };
}

export function flattenExamQuestion(question: unknown, withOrg = false) {
  const q = question && typeof question === "object" ? (question as AnyRecord) : {};
  const audio = q.audio && typeof q.audio === "object" ? q.audio : {};
  const image = q.image && typeof q.image === "object" ? q.image : {};
  return {
    questionContent: asText(q.content),
    ...(withOrg ? { questionContentOrg: asText(q.contentOrg) } : {}),
    questionAudioLink: asText(audio.link),
    questionAudioName: asText(audio.name),
    questionImageLink: asText(image.link),
    questionImageName: asText(image.name),
  };
}

export function examQuestionFromFlat(doc: AnyRecord, withOrg = false) {
  const audio =
    doc.questionAudioLink || doc.questionAudioName
      ? { link: doc.questionAudioLink ?? null, name: doc.questionAudioName ?? null }
      : undefined;
  const image =
    doc.questionImageLink || doc.questionImageName
      ? { link: doc.questionImageLink ?? null, name: doc.questionImageName ?? null }
      : undefined;
  const question: AnyRecord = { content: doc.questionContent ?? "" };
  if (withOrg) question.contentOrg = doc.questionContentOrg ?? null;
  if (audio) question.audio = audio;
  if (image) question.image = image;
  return question;
}

export type SentenceKey = "translation" | "reading" | "en" | "cn";

const SENTENCE_FIELD: Record<SentenceKey, string> = {
  translation: "sentenceTranslation",
  reading: "sentenceReading",
  en: "sentenceEn",
  cn: "sentenceCn",
};

export function flattenSentence(sentence: unknown, keys: readonly SentenceKey[]) {
  const s = sentence && typeof sentence === "object" ? (sentence as AnyRecord) : {};
  const next: AnyRecord = {};
  for (const key of keys) next[SENTENCE_FIELD[key]] = asText(s[key]);
  return next;
}

export function sentenceFromFlat(doc: AnyRecord, keys: readonly SentenceKey[]) {
  const sentence: AnyRecord = {};
  let any = false;
  for (const key of keys) {
    const value = doc[SENTENCE_FIELD[key]];
    if (value == null) continue;
    sentence[key] = value;
    any = true;
  }
  return any ? sentence : null;
}

export function flattenTodayQuestion(question: unknown) {
  const q = question && typeof question === "object" ? (question as AnyRecord) : {};
  const parsed = q.answer == null || q.answer === "" ? null : Number.parseInt(String(q.answer), 10);
  return {
    questionText: asText(q.question),
    questionAnswer: Number.isNaN(parsed as number) ? null : parsed,
  };
}

export function todayChoiceList(question: unknown): string[] {
  const q = question && typeof question === "object" ? (question as AnyRecord) : {};
  const list = q.choice ?? q.choices;
  if (!Array.isArray(list)) return [];
  return list.map((item) => (item == null ? "" : String(item)));
}

export function todayQuestionFromFlat(doc: AnyRecord) {
  const choice = (doc.questionChoices || [])
    .slice()
    .sort((a: AnyRecord, b: AnyRecord) => (a.sort ?? 0) - (b.sort ?? 0))
    .map((item: AnyRecord) => item.content ?? "");
  if (doc.questionText == null && doc.questionAnswer == null && !choice.length) return null;
  return {
    question: doc.questionText,
    choice,
    answer: doc.questionAnswer,
  };
}

export function normalizeChoices(choices: unknown): Array<{ no: number; content: string | null }> {
  if (!Array.isArray(choices)) return [];
  return choices.map((item, index) => {
    if (item && typeof item === "object") {
      const no = Number((item as AnyRecord).no);
      return {
        no: Number.isNaN(no) ? index + 1 : no,
        content: (item as AnyRecord).content == null ? null : String((item as AnyRecord).content),
      };
    }
    return { no: index + 1, content: item == null ? null : String(item) };
  });
}

export function choicesFromRows(rows: AnyRecord[] | undefined) {
  return (rows || [])
    .slice()
    .sort((a, b) => (a.no ?? 0) - (b.no ?? 0))
    .map((item) => ({ no: item.no, content: item.content }));
}

export function stringListFromRows(rows: AnyRecord[] | undefined) {
  return (rows || [])
    .slice()
    .sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
    .map((item) => item.value);
}

function omitFields(doc: AnyRecord, extras: string[] = []) {
  const next = { ...doc };
  for (const key of [...EXAM_FLAT_FIELDS, ...extras]) delete next[key];
  return next;
}

type ExamReadOptions = {
  withOrg?: boolean;
  sentenceKeys: readonly SentenceKey[];
  locale?: boolean;
};

export function transformExamRead(doc: AnyRecord, options: ExamReadOptions) {
  return {
    ...omitFields(doc),
    question: examQuestionFromFlat(doc, options.withOrg),
    sentence: sentenceFromFlat(doc, options.sentenceKeys),
    choices: choicesFromRows(doc.choices),
    ...(options.locale ? { sentence_locale: localeFromFlat(doc, "sentence") } : {}),
  };
}

export function transformTodayRead(doc: AnyRecord, withWordLocale = false) {
  return {
    ...omitFields(doc),
    question: todayQuestionFromFlat(doc),
    sentence_locale: localeFromFlat(doc, "sentence"),
    ...(withWordLocale ? { word_locale: localeFromFlat(doc, "word") } : {}),
  };
}

export function transformWordRead(doc: AnyRecord) {
  return {
    ...omitFields(doc),
    means: stringListFromRows(doc.means),
    parts: stringListFromRows(doc.parts),
  };
}

export function transformUserRead(doc: AnyRecord) {
  return {
    ...doc,
    role: stringListFromRows(doc.roles),
  };
}

export function transformCodeDetailRead(doc: AnyRecord) {
  return {
    ...doc,
    levels: stringListFromRows(doc.levels),
  };
}

export function writeExam(
  data: AnyRecord,
  options: { withOrg?: boolean; sentenceKeys: readonly SentenceKey[]; locale?: boolean }
) {
  const next = { ...data };
  if (data.question !== undefined) Object.assign(next, flattenExamQuestion(data.question, options.withOrg));
  if (data.sentence !== undefined) Object.assign(next, flattenSentence(data.sentence, options.sentenceKeys));
  if (options.locale && data.sentence_locale !== undefined) {
    Object.assign(next, flattenLocale(data.sentence_locale, "sentence"));
  }
  return next;
}

export function writeToday(data: AnyRecord, withWordLocale = false) {
  const next = { ...data };
  if (data.question !== undefined) Object.assign(next, flattenTodayQuestion(data.question));
  if (data.sentence_locale !== undefined) Object.assign(next, flattenLocale(data.sentence_locale, "sentence"));
  if (withWordLocale && data.word_locale !== undefined) {
    Object.assign(next, flattenLocale(data.word_locale, "word"));
  }
  return next;
}

type ListDelegate = {
  deleteMany: (args?: any) => Promise<unknown>;
  createMany: (args?: any) => Promise<unknown>;
};

export async function syncStringList(
  delegate: ListDelegate,
  fk: string,
  id: string,
  values: unknown
) {
  if (!Array.isArray(values)) return;
  await delegate.deleteMany({ where: { [fk]: id } });
  if (!values.length) return;
  await delegate.createMany({
    data: values.map((value, sort) => ({
      id: newId(),
      [fk]: id,
      sort,
      value: String(value ?? ""),
    })),
  });
}

export async function syncChoices(delegate: ListDelegate, id: string, choices: unknown) {
  if (choices === undefined) return;
  const list = normalizeChoices(choices);
  await delegate.deleteMany({ where: { parentId: id } });
  if (!list.length) return;
  await delegate.createMany({
    data: list.map((item) => ({
      id: newId(),
      parentId: id,
      no: item.no,
      content: item.content,
    })),
  });
}

export async function syncTodayChoices(delegate: ListDelegate, id: string, question: unknown) {
  if (question === undefined) return;
  const list = todayChoiceList(question);
  await delegate.deleteMany({ where: { parentId: id } });
  if (!list.length) return;
  await delegate.createMany({
    data: list.map((content, sort) => ({
      id: newId(),
      parentId: id,
      sort,
      content,
    })),
  });
}
