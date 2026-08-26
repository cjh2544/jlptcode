/**
 * Refresh word_today (+ question choices) from Mongo (read-only).
 * Replaces local rows so later Mongo edits are not skipped by createMany skipDuplicates.
 */
import { config } from "dotenv";
import { MongoClient, ObjectId } from "mongodb";
import { PrismaClient } from "@prisma/client";
import { newId } from "../../src/app/lib/new-id";
import { flattenLocale, flattenTodayQuestion, todayChoiceList } from "../../src/app/lib/content-shape";

config({ path: ".env.local" });
config({ path: ".env" });

const MONGO_COPY_URL = (
  process.env.MONGODB_URL ||
  process.env.MONGODB_URI ||
  process.env.MONGO_COPY_URL ||
  ""
).trim();
const prisma = new PrismaClient();
const CHUNK = 200;

function asId(value: unknown) {
  if (value instanceof ObjectId) return value.toHexString();
  if (value == null) return undefined;
  return String(value);
}

function asDate(value: unknown) {
  if (!value) return undefined;
  const date = value instanceof Date ? value : new Date(String(value));
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function asInt(value: unknown, fallback?: number | null) {
  if (value == null || value === "") return fallback;
  const parsed = Number.parseInt(String(value), 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}

function asString(value: unknown, fallback?: string | null) {
  if (value == null || value === "") return fallback === undefined ? value : fallback;
  return String(value);
}

function clip(value: unknown, max: number, fallback = "") {
  return String(asString(value, fallback) ?? fallback).slice(0, max);
}

function todayChoiceCreates(parentId: string, question: unknown) {
  return todayChoiceList(question).map((content, sort) => ({
    id: newId(),
    parentId,
    sort,
    content,
  }));
}

async function coverage() {
  const rows = await prisma.$queryRawUnsafe<
    Array<{
      total: bigint;
      sentence_en: bigint;
      word_en: bigint;
      with_keyword: bigint;
      with_day: bigint;
      with_sentence: bigint;
    }>
  >(`
    SELECT
      COUNT(*) AS total,
      SUM(CASE WHEN sentence_locale_en IS NOT NULL AND sentence_locale_en <> '' THEN 1 ELSE 0 END) AS sentence_en,
      SUM(CASE WHEN word_locale_en IS NOT NULL AND word_locale_en <> '' THEN 1 ELSE 0 END) AS word_en,
      SUM(CASE WHEN keyword IS NOT NULL AND keyword <> '' THEN 1 ELSE 0 END) AS with_keyword,
      SUM(CASE WHEN day IS NOT NULL THEN 1 ELSE 0 END) AS with_day,
      SUM(CASE WHEN sentence IS NOT NULL AND sentence <> '' THEN 1 ELSE 0 END) AS with_sentence
    FROM word_today
  `);
  const n = (v: bigint | undefined) => Number(v ?? 0);
  return {
    total: n(rows[0]?.total),
    sentence_en: n(rows[0]?.sentence_en),
    word_en: n(rows[0]?.word_en),
    with_keyword: n(rows[0]?.with_keyword),
    with_day: n(rows[0]?.with_day),
    with_sentence: n(rows[0]?.with_sentence),
  };
}

async function insertChunks<T>(label: string, rows: T[], insert: (chunk: T[]) => Promise<unknown>) {
  for (let i = 0; i < rows.length; i += CHUNK) {
    await insert(rows.slice(i, i + CHUNK));
    console.log(`  ${label}: ${Math.min(i + CHUNK, rows.length)}/${rows.length}`);
  }
}

async function main() {
  if (!MONGO_COPY_URL) {
    throw new Error("MONGO_COPY_URL (or MONGODB_URL) is required.");
  }

  console.log("MariaDB before:", await coverage());

  const mongo = new MongoClient(MONGO_COPY_URL, { readPreference: "secondaryPreferred" });
  await mongo.connect();
  const docs = await mongo.db().collection("word_today").find({}).toArray();

  const parents = docs
    .map((doc) => {
      const id = asId(doc._id);
      if (!id) return null;
      return {
        id,
        level: clip(doc.level, 20, ""),
        year: clip(doc.year, 20, ""),
        study: clip(doc.study, 50, ""),
        day: asInt(doc.day, null),
        wordNo: asInt(doc.wordNo, 0) ?? 0,
        word: clip(doc.word, 191, ""),
        read: clip(doc.read, 191, ""),
        means: asString(doc.means, "") ?? "",
        sentence: doc.sentence ?? null,
        sentence_read: doc.sentence_read ?? null,
        sentence_translate: doc.sentence_translate ?? null,
        keyword: doc.keyword == null || doc.keyword === "" ? null : clip(doc.keyword, 191),
        speaker: asString(doc.speaker, null),
        sortNo: asInt(doc.sortNo, null),
        createdAt: asDate(doc.createdAt) ?? new Date(),
        updatedAt: asDate(doc.updatedAt) ?? new Date(),
        ...flattenLocale(doc.word_locale, "word"),
        ...flattenLocale(doc.sentence_locale, "sentence"),
        ...flattenTodayQuestion(doc.question),
      };
    })
    .filter((row): row is NonNullable<typeof row> => row != null);

  const choices = docs.flatMap((doc) => todayChoiceCreates(asId(doc._id)!, doc.question));

  await prisma.wordToday.deleteMany();
  await insertChunks("word_today", parents, (data) =>
    prisma.wordToday.createMany({ data: data as any })
  );
  await insertChunks("word_today_question_choice", choices, (data) =>
    prisma.wordTodayQuestionChoice.createMany({ data })
  );

  const byLevel = await prisma.$queryRawUnsafe<Array<{ level: string; n: bigint }>>(
    `SELECT level, COUNT(*) AS n FROM word_today GROUP BY level ORDER BY level`
  );

  console.log("Mongo source:", docs.length);
  console.log("MariaDB after:", await coverage());
  console.log(
    "by level:",
    Object.fromEntries(byLevel.map((row) => [row.level, Number(row.n)]))
  );

  await mongo.close();
  await prisma.$disconnect();
}

main().catch(async (error) => {
  console.error(error);
  await prisma.$disconnect();
  process.exit(1);
});
