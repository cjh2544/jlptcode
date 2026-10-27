/**
 * Refresh level_up (+ choices) from Mongo (read-only).
 * Replaces local rows so later Mongo edits are not skipped by createMany skipDuplicates.
 */
import { config } from "dotenv";
import { MongoClient, ObjectId } from "mongodb";
import { PrismaClient } from "@prisma/client";
import { newId } from "../../src/app/lib/new-id";
import {
  flattenExamQuestion,
  flattenLocale,
  flattenSentence,
  normalizeChoices,
} from "../../src/app/lib/content-shape";

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

function choiceCreates(parentId: string, choices: unknown) {
  return normalizeChoices(choices).map((item) => ({
    id: newId(),
    parentId,
    no: item.no,
    content: item.content,
  }));
}

async function coverage() {
  const rows = await prisma.$queryRawUnsafe<
    Array<{
      total: bigint;
      with_content: bigint;
      with_answer: bigint;
      with_speaker: bigint;
      sentence_en: bigint;
      choice_count: bigint;
    }>
  >(`
    SELECT
      COUNT(*) AS total,
      SUM(CASE WHEN question_content IS NOT NULL AND question_content <> '' THEN 1 ELSE 0 END) AS with_content,
      SUM(CASE WHEN answer IS NOT NULL THEN 1 ELSE 0 END) AS with_answer,
      SUM(CASE WHEN speaker IS NOT NULL AND speaker <> '' THEN 1 ELSE 0 END) AS with_speaker,
      SUM(CASE WHEN sentence_locale_en IS NOT NULL AND sentence_locale_en <> '' THEN 1 ELSE 0 END) AS sentence_en,
      (SELECT COUNT(*) FROM level_up_choice) AS choice_count
    FROM level_up
  `);
  const n = (v: bigint | undefined) => Number(v ?? 0);
  return {
    total: n(rows[0]?.total),
    with_content: n(rows[0]?.with_content),
    with_answer: n(rows[0]?.with_answer),
    with_speaker: n(rows[0]?.with_speaker),
    sentence_en: n(rows[0]?.sentence_en),
    choice_count: n(rows[0]?.choice_count),
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
  const docs = await mongo.db().collection("level_up").find({}).toArray();

  const parents = docs
    .map((doc) => {
      const id = asId(doc._id);
      if (!id) return null;
      return {
        id,
        year: clip(doc.year, 20, ""),
        level: clip(doc.level, 20, ""),
        sortNo: asInt(doc.sortNo, 0) ?? 0,
        classification: clip(doc.classification, 50, ""),
        questionNo: asInt(doc.questionNo, null),
        questionGroupNo: asInt(doc.questionGroupNo, null),
        questionContentNo: asInt(doc.questionContentNo, null),
        questionGroupType: clip(doc.questionGroupType, 50, ""),
        questionType: doc.questionType == null || doc.questionType === "" ? null : clip(doc.questionType, 20),
        answer: asInt(doc.answer, null),
        speaker: asString(doc.speaker, null),
        createdAt: asDate(doc.createdAt) ?? new Date(),
        updatedAt: asDate(doc.updatedAt) ?? new Date(),
        ...flattenExamQuestion(doc.question, true),
        ...flattenSentence(doc.sentence, ["translation", "reading"]),
        ...flattenLocale(doc.sentence_locale, "sentence"),
      };
    })
    .filter((row): row is NonNullable<typeof row> => row != null);

  const choices = docs.flatMap((doc) => choiceCreates(asId(doc._id)!, doc.choices));

  await prisma.levelUp.deleteMany();
  await insertChunks("level_up", parents, (data) =>
    prisma.levelUp.createMany({ data: data as any })
  );
  await insertChunks("level_up_choice", choices, (data) =>
    prisma.levelUpChoice.createMany({ data })
  );

  const byLevel = await prisma.$queryRawUnsafe<Array<{ level: string; n: bigint }>>(
    `SELECT level, COUNT(*) AS n FROM level_up GROUP BY level ORDER BY level`
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
