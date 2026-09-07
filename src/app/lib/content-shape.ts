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

const FULLWIDTH_DIGITS = "０１２３４５６７８９";

/** Parse leading choice label like `1)`, `2）`, `４)`. */
export function parseChoiceNoFromContent(content: unknown): number | null {
  const text = String(content ?? "").trim();
  const match = text.match(/^([0-9０-９]+)\s*[\)）]/);
  if (!match) return null;
  const digits = match[1].replace(/[０-９]/g, (ch) => String(FULLWIDTH_DIGITS.indexOf(ch)));
  const no = Number(digits);
  return Number.isFinite(no) && no > 0 ? no : null;
}

function hasUniquePositiveNos(nos: number[]) {
  return nos.length > 0 && nos.every((n) => Number.isFinite(n) && n > 0) && new Set(nos).size === nos.length;
}

type OrderedExamChoice = {
  sourceIndex: number;
  no: number;
  content: string | null;
};

/**
 * Ensure choices are numbered 1..n in display order.
 * Repairs bad level_up data where `no` is 0 / duplicated while content still has `1)`…`4)`.
 */
function orderExamChoiceEntries(
  choices: Array<{ no?: unknown; content?: unknown } | null | undefined> | unknown
): OrderedExamChoice[] {
  if (!Array.isArray(choices)) return [];

  const raw = choices.map((item, index) => {
    if (item && typeof item === "object") {
      const parsedNo = Number((item as AnyRecord).no);
      return {
        index,
        rawNo: Number.isFinite(parsedNo) ? parsedNo : NaN,
        fromContent: parseChoiceNoFromContent((item as AnyRecord).content),
        content: (item as AnyRecord).content == null ? null : String((item as AnyRecord).content),
      };
    }
    return {
      index,
      rawNo: NaN,
      fromContent: parseChoiceNoFromContent(item),
      content: item == null ? null : String(item),
    };
  });

  const rawNos = raw.map((item) => item.rawNo);
  const contentNos = raw.map((item) => item.fromContent);
  const rawValid = hasUniquePositiveNos(rawNos);
  const contentValid =
    contentNos.every((n): n is number => n != null) && new Set(contentNos).size === contentNos.length;

  // Prefer labels in content when DB `no` is missing/duplicated/0-based or disagrees with labels.
  const useContent =
    contentValid && (!rawValid || raw.some((item) => item.fromContent !== item.rawNo));

  let ordered = raw;
  if (useContent) {
    ordered = [...raw].sort(
      (a, b) => (a.fromContent as number) - (b.fromContent as number) || a.index - b.index
    );
  } else if (rawValid) {
    ordered = [...raw].sort((a, b) => a.rawNo - b.rawNo || a.index - b.index);
  } else {
    // 0-based or broken nos without labels: keep relative no/index order, then renumber.
    ordered = [...raw].sort(
      (a, b) =>
        (Number.isFinite(a.rawNo) ? a.rawNo : a.index) - (Number.isFinite(b.rawNo) ? b.rawNo : b.index) ||
        a.index - b.index
    );
  }

  return ordered.map((item, index) => ({
    sourceIndex: item.index,
    no: useContent ? (item.fromContent as number) : rawValid ? item.rawNo : index + 1,
    content: item.content,
  }));
}

export function orderExamChoices(
  choices: Array<{ no?: unknown; content?: unknown } | null | undefined> | unknown
): Array<{ no: number; content: string | null }> {
  return orderExamChoiceEntries(choices).map(({ no, content }) => ({ no, content }));
}

/** Keep original row fields and rewrite `no` / `content` to the repaired order. */
export function withOrderedExamChoiceNos<T extends { no?: unknown; content?: unknown }>(
  choices: T[]
): Array<T & { no: number; content: string | null }> {
  return orderExamChoiceEntries(choices).map((item) => ({
    ...choices[item.sourceIndex],
    no: item.no,
    content: item.content,
  }));
}

export function normalizeChoices(choices: unknown): Array<{ no: number; content: string | null }> {
  return orderExamChoices(choices);
}

export function choicesFromRows(rows: AnyRecord[] | undefined) {
  return orderExamChoices(rows);
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

export function flattenValueLocale(locale: unknown) {
  const obj = locale && typeof locale === "object" ? (locale as AnyRecord) : {};
  return {
    valueLocaleJa: asText(obj.ja),
    valueLocaleEn: asText(obj.en),
    valueLocaleCn: asText(obj.cn),
    valueLocaleMy: asText(obj.my),
  };
}

export function valueLocaleFromFlat(doc: AnyRecord) {
  const ja = doc.valueLocaleJa ?? null;
  const en = doc.valueLocaleEn ?? null;
  const cn = doc.valueLocaleCn ?? null;
  const my = doc.valueLocaleMy ?? null;
  if (ja == null && en == null && cn == null && my == null) return null;
  return { ja, en, cn, my };
}

export function transformCodeDetailRead(doc: AnyRecord) {
  const { valueLocaleJa, valueLocaleEn, valueLocaleCn, valueLocaleMy, ...rest } = doc;
  return {
    ...rest,
    levels: stringListFromRows(doc.levels),
    value_locale: valueLocaleFromFlat(doc),
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
