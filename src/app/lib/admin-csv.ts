/**
 * Admin data CSV export/import (UTF-8 BOM).
 * Nested choices (보기) are flattened to choice1..choiceN on one row.
 */
import {
  getAdminTableMeta,
  type AdminFieldConfig,
  type AdminTableMeta,
} from "@/app/admin/data/table-config";
import { orderExamChoices } from "@/app/lib/content-shape";

const UTF8_BOM = "\uFEFF";
const MIN_CHOICE_COLS = 4;
const MIN_LIST_COLS = 4;
/** Fixed widths for streaming export (avoids scanning all rows first). */
const STREAM_CHOICE_COLS = 6;
const STREAM_LIST_COLS = 8;

const TODAY_TABLES = new Set(["word_today", "sentence_today", "grammar_today"]);
const EXAM_TABLES = new Set(["jlpt", "jlpt_test", "jpt", "level_up"]);
const WORD_TABLES = new Set(["word", "jpt_word"]);

type AnyRecord = Record<string, any>;

export function isAdminCsvTable(table: string) {
  return Boolean(getAdminTableMeta(table));
}

function asObject(value: unknown): AnyRecord {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as AnyRecord)
    : {};
}

function cellText(value: unknown) {
  if (value == null) return "";
  return String(value);
}

function choiceContentsFromRow(row: AnyRecord): string[] {
  if (Array.isArray(row.choices)) {
    return orderExamChoices(row.choices).map((item) => cellText(item.content));
  }
  const question = asObject(row.question);
  if (Array.isArray(question.choice)) {
    return question.choice.map((item: unknown) => cellText(item));
  }
  if (Array.isArray(question.choices)) {
    return orderExamChoices(question.choices).map((item) => cellText(item.content));
  }
  return [];
}

function stringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => cellText(item));
}

function numberedHeaders(prefix: string, count: number) {
  return Array.from({ length: count }, (_, i) => `${prefix}${i + 1}`);
}

function maxCount(rows: AnyRecord[], getter: (row: AnyRecord) => string[]) {
  let max = 0;
  for (const row of rows) max = Math.max(max, getter(row).length);
  return max;
}

/** Columns that replace nested JSON fields in CSV. */
function expandedFieldKeys(table: string, field: AdminFieldConfig): string[] | null {
  if (field.key === "choices") {
    return null; // filled dynamically as choice1..n
  }
  if (field.key === "question") {
    if (TODAY_TABLES.has(table)) {
      return ["question_text", "question_answer"];
    }
    if (EXAM_TABLES.has(table)) {
      const keys = [
        "question_content",
        "question_audio_link",
        "question_audio_name",
        "question_image_link",
        "question_image_name",
      ];
      if (table === "level_up") keys.splice(1, 0, "question_content_org");
      return keys;
    }
  }
  if (field.key === "sentence" && field.type === "json") {
    return ["sentence_translation", "sentence_reading", "sentence_en", "sentence_cn"];
  }
  if (field.key === "sentence_locale") {
    return ["sentence_locale_en", "sentence_locale_cn", "sentence_locale_my"];
  }
  if (field.key === "word_locale") {
    return ["word_locale_en", "word_locale_cn", "word_locale_my"];
  }
  if (field.key === "value_locale") {
    return ["value_locale_ja", "value_locale_en", "value_locale_cn", "value_locale_my"];
  }
  if (field.key === "means" && field.type === "json") return null; // mean1..n
  if (field.key === "parts" && field.type === "json") return null; // part1..n
  if (field.key === "levels" && field.type === "json") return null; // level1..n
  // level_up form has questionContentOrg; covered by question_content_org
  if (field.key === "questionContentOrg") return [];
  return [field.key];
}

export function buildCsvHeaders(
  table: string,
  meta: AdminTableMeta,
  rows: AnyRecord[] = [],
  options?: { fixedCounts?: boolean },
): string[] {
  const fixed = Boolean(options?.fixedCounts);
  const choiceCount = fixed
    ? STREAM_CHOICE_COLS
    : Math.max(MIN_CHOICE_COLS, maxCount(rows, choiceContentsFromRow));
  const meanCount = WORD_TABLES.has(table)
    ? fixed
      ? STREAM_LIST_COLS
      : Math.max(MIN_LIST_COLS, maxCount(rows, (row) => stringList(row.means)))
    : 0;
  const partCount = WORD_TABLES.has(table)
    ? fixed
      ? STREAM_LIST_COLS
      : Math.max(MIN_LIST_COLS, maxCount(rows, (row) => stringList(row.parts)))
    : 0;
  const levelCount =
    table === "code_detail"
      ? fixed
        ? STREAM_LIST_COLS
        : Math.max(MIN_LIST_COLS, maxCount(rows, (row) => stringList(row.levels)))
      : 0;

  const headers: string[] = ["id"];
  const hasChoicesField = meta.fields.some(
    (field) => field.key === "choices" || (field.key === "question" && TODAY_TABLES.has(table)),
  );

  for (const field of meta.fields) {
    if (field.key === "choices") {
      headers.push(...numberedHeaders("choice", choiceCount));
      continue;
    }
    if (field.key === "question" && TODAY_TABLES.has(table)) {
      headers.push("question_text", "question_answer", ...numberedHeaders("choice", choiceCount));
      continue;
    }
    if (field.key === "means" && field.type === "json") {
      headers.push(...numberedHeaders("mean", meanCount || MIN_LIST_COLS));
      continue;
    }
    if (field.key === "parts" && field.type === "json") {
      headers.push(...numberedHeaders("part", partCount || MIN_LIST_COLS));
      continue;
    }
    if (field.key === "levels" && field.type === "json") {
      headers.push(...numberedHeaders("level", levelCount || MIN_LIST_COLS));
      continue;
    }
    const expanded = expandedFieldKeys(table, field);
    if (expanded) headers.push(...expanded);
  }

  // Exam tables always expose choice columns when choices exist on model.
  if (EXAM_TABLES.has(table) && !hasChoicesField) {
    headers.push(...numberedHeaders("choice", choiceCount));
  }

  return headers;
}

/** Stable headers for chunked/stream export (no full-table scan). */
export function buildStreamCsvHeaders(table: string, meta: AdminTableMeta) {
  return buildCsvHeaders(table, meta, [], { fixedCounts: true });
}

function readNumbered(record: Record<string, string>, prefix: string): string[] {
  const values: string[] = [];
  for (let i = 1; i <= 50; i++) {
    const key = `${prefix}${i}`;
    if (!(key in record)) {
      if (i > MIN_CHOICE_COLS && i > MIN_LIST_COLS) break;
      continue;
    }
    values.push(record[key] ?? "");
  }
  // trim trailing empties
  while (values.length && !values[values.length - 1].trim()) values.pop();
  return values;
}

export function rowToCsvRecord(
  table: string,
  meta: AdminTableMeta,
  row: AnyRecord,
  headers: string[],
): Record<string, string> {
  const record: Record<string, string> = {};
  for (const header of headers) record[header] = "";

  record.id = cellText(row.id ?? row._id);

  const question = asObject(row.question);
  const sentence = asObject(row.sentence);
  const sentenceLocale = asObject(row.sentence_locale);
  const wordLocale = asObject(row.word_locale);
  const valueLocale = asObject(row.value_locale);
  const choices = choiceContentsFromRow(row);

  for (const field of meta.fields) {
    if (field.key === "choices" || (field.key === "question" && TODAY_TABLES.has(table))) {
      continue;
    }
    if (field.key === "question" && EXAM_TABLES.has(table)) {
      record.question_content = cellText(question.content);
      if ("question_content_org" in record) {
        record.question_content_org = cellText(question.contentOrg ?? row.questionContentOrg);
      }
      record.question_audio_link = cellText(question.audio?.link);
      record.question_audio_name = cellText(question.audio?.name);
      record.question_image_link = cellText(question.image?.link);
      record.question_image_name = cellText(question.image?.name);
      continue;
    }
    if (field.key === "sentence" && field.type === "json") {
      record.sentence_translation = cellText(sentence.translation);
      record.sentence_reading = cellText(sentence.reading);
      record.sentence_en = cellText(sentence.en);
      record.sentence_cn = cellText(sentence.cn);
      continue;
    }
    if (field.key === "sentence_locale") {
      record.sentence_locale_en = cellText(sentenceLocale.en);
      record.sentence_locale_cn = cellText(sentenceLocale.cn);
      record.sentence_locale_my = cellText(sentenceLocale.my);
      continue;
    }
    if (field.key === "word_locale") {
      record.word_locale_en = cellText(wordLocale.en);
      record.word_locale_cn = cellText(wordLocale.cn);
      record.word_locale_my = cellText(wordLocale.my);
      continue;
    }
    if (field.key === "value_locale") {
      record.value_locale_ja = cellText(valueLocale.ja);
      record.value_locale_en = cellText(valueLocale.en);
      record.value_locale_cn = cellText(valueLocale.cn);
      record.value_locale_my = cellText(valueLocale.my);
      continue;
    }
    if (field.key === "means" && field.type === "json") {
      stringList(row.means).forEach((value, i) => {
        record[`mean${i + 1}`] = value;
      });
      continue;
    }
    if (field.key === "parts" && field.type === "json") {
      stringList(row.parts).forEach((value, i) => {
        record[`part${i + 1}`] = value;
      });
      continue;
    }
    if (field.key === "levels" && field.type === "json") {
      stringList(row.levels).forEach((value, i) => {
        record[`level${i + 1}`] = value;
      });
      continue;
    }
    if (field.key === "questionContentOrg") continue;

    if (field.key in record) {
      const value = row[field.key];
      record[field.key] = value == null ? "" : String(value);
    }
  }

  if (TODAY_TABLES.has(table)) {
    if ("question_text" in record) record.question_text = cellText(question.question);
    if ("question_answer" in record) {
      record.question_answer = cellText(question.answer ?? row.questionAnswer);
    }
  }

  choices.forEach((value, i) => {
    const key = `choice${i + 1}`;
    if (key in record) record[key] = value;
  });

  return record;
}

function localeFromPrefix(record: Record<string, string>, prefix: string, keys: string[]) {
  const obj: AnyRecord = {};
  let any = false;
  for (const key of keys) {
    const value = record[`${prefix}_${key}`]?.trim();
    if (!value) continue;
    obj[key] = value;
    any = true;
  }
  return any ? obj : undefined;
}

export function csvRecordToPayload(
  table: string,
  meta: AdminTableMeta,
  record: Record<string, string>,
): Record<string, unknown> {
  const payload: AnyRecord = {};
  const choiceValues = readNumbered(record, "choice");

  for (const field of meta.fields) {
    if (field.key === "choices") {
      if (choiceValues.length) {
        payload.choices = choiceValues.map((content, index) => ({
          no: index + 1,
          content: content || null,
        }));
      }
      continue;
    }

    if (field.key === "question" && TODAY_TABLES.has(table)) {
      const questionText = record.question_text?.trim() ?? "";
      const answerRaw = record.question_answer?.trim() ?? "";
      const answer = answerRaw ? Number(answerRaw) : null;
      if (questionText || choiceValues.length || answerRaw) {
        payload.question = {
          question: questionText || null,
          choice: choiceValues,
          answer: answer != null && !Number.isNaN(answer) ? answer : null,
        };
      }
      continue;
    }

    if (field.key === "question" && EXAM_TABLES.has(table)) {
      const content = record.question_content ?? "";
      const contentOrg = record.question_content_org ?? "";
      const audioLink = record.question_audio_link?.trim() ?? "";
      const audioName = record.question_audio_name?.trim() ?? "";
      const imageLink = record.question_image_link?.trim() ?? "";
      const imageName = record.question_image_name?.trim() ?? "";
      const question: AnyRecord = { content };
      if (table === "level_up") question.contentOrg = contentOrg || null;
      if (audioLink || audioName) question.audio = { link: audioLink || null, name: audioName || null };
      if (imageLink || imageName) question.image = { link: imageLink || null, name: imageName || null };
      payload.question = question;
      continue;
    }

    if (field.key === "sentence" && field.type === "json") {
      const sentence: AnyRecord = {};
      let any = false;
      for (const key of ["translation", "reading", "en", "cn"] as const) {
        const value = record[`sentence_${key}`]?.trim();
        if (!value) continue;
        sentence[key] = value;
        any = true;
      }
      if (any) payload.sentence = sentence;
      continue;
    }

    if (field.key === "sentence_locale") {
      const locale = localeFromPrefix(record, "sentence_locale", ["en", "cn", "my"]);
      if (locale) payload.sentence_locale = locale;
      continue;
    }

    if (field.key === "word_locale") {
      const locale = localeFromPrefix(record, "word_locale", ["en", "cn", "my"]);
      if (locale) payload.word_locale = locale;
      continue;
    }

    if (field.key === "value_locale") {
      const locale = localeFromPrefix(record, "value_locale", ["ja", "en", "cn", "my"]);
      if (locale) payload.value_locale = locale;
      continue;
    }

    if (field.key === "means" && field.type === "json") {
      const means = readNumbered(record, "mean");
      if (means.length) payload.means = means;
      continue;
    }

    if (field.key === "parts" && field.type === "json") {
      const parts = readNumbered(record, "part");
      if (parts.length) payload.parts = parts;
      continue;
    }

    if (field.key === "levels" && field.type === "json") {
      const levels = readNumbered(record, "level");
      if (levels.length) payload.levels = levels;
      continue;
    }

    if (field.key === "questionContentOrg") {
      // Prefer nested question.contentOrg; keep scalar only if provided alone.
      const org = record.question_content_org?.trim();
      if (org) payload.questionContentOrg = org;
      continue;
    }

    const raw = record[field.key];
    if (raw === undefined) continue;
    if (!String(raw).trim() && !field.required) continue;

    if (field.type === "number") {
      if (!String(raw).trim()) continue;
      const parsed = Number(raw);
      if (Number.isNaN(parsed)) throw new Error(`invalid number: ${field.key}`);
      payload[field.key] = parsed;
      continue;
    }

    if (field.type === "json") {
      if (!String(raw).trim()) continue;
      payload[field.key] = JSON.parse(String(raw));
      continue;
    }

    payload[field.key] = raw;
  }

  // Exam choices when field exists (already handled) — ensure level_up/jlpt always sync
  if (EXAM_TABLES.has(table) && choiceValues.length && payload.choices === undefined) {
    payload.choices = choiceValues.map((content, index) => ({
      no: index + 1,
      content: content || null,
    }));
  }

  return payload;
}

export function escapeCsvCell(value: string) {
  if (/[",\r\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function recordsToCsv(headers: string[], records: Record<string, string>[]) {
  const lines = [
    headers.map(escapeCsvCell).join(","),
    ...records.map((record) => headers.map((key) => escapeCsvCell(record[key] ?? "")).join(",")),
  ];
  return UTF8_BOM + lines.join("\r\n") + "\r\n";
}

export function csvHeaderLine(headers: string[]) {
  return headers.map(escapeCsvCell).join(",");
}

export function csvDataLines(
  table: string,
  meta: AdminTableMeta,
  headers: string[],
  rows: AnyRecord[],
) {
  if (!rows.length) return "";
  return rows
    .map((row) => {
      const record = rowToCsvRecord(table, meta, row, headers);
      return headers.map((key) => escapeCsvCell(record[key] ?? "")).join(",");
    })
    .join("\r\n");
}

export function buildCsvForRows(table: string, rows: AnyRecord[]) {
  const meta = getAdminTableMeta(table);
  if (!meta) throw new Error(`Unknown table: ${table}`);
  const headers = buildCsvHeaders(table, meta, rows);
  const records = rows.map((row) => rowToCsvRecord(table, meta, row, headers));
  return recordsToCsv(headers, records);
}

export { UTF8_BOM };

export function parseCsv(text: string): { headers: string[]; records: Record<string, string>[] } {
  const raw = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;

  for (let i = 0; i < raw.length; i++) {
    const ch = raw[i];
    const next = raw[i + 1];
    if (inQuotes) {
      if (ch === '"' && next === '"') {
        cell += '"';
        i += 1;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        cell += ch;
      }
      continue;
    }
    if (ch === '"') {
      inQuotes = true;
      continue;
    }
    if (ch === ",") {
      row.push(cell);
      cell = "";
      continue;
    }
    if (ch === "\r") continue;
    if (ch === "\n") {
      row.push(cell);
      cell = "";
      if (row.some((item) => item.length)) rows.push(row);
      row = [];
      continue;
    }
    cell += ch;
  }
  if (cell.length || row.length) {
    row.push(cell);
    if (row.some((item) => item.length)) rows.push(row);
  }

  if (!rows.length) return { headers: [], records: [] };
  const headers = rows[0].map((item) => item.trim());
  const records = rows.slice(1).map((cells) => {
    const record: Record<string, string> = {};
    headers.forEach((header, index) => {
      record[header] = cells[index] ?? "";
    });
    return record;
  });
  return { headers, records };
}
