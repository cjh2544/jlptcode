/**
 * Copy JSON columns into flattened scalars + child tables.
 * Run after 003_split_json.sql and before 004_drop_json.sql.
 * Uses raw SQL so it works with either Prisma schema.
 */
import { config } from "dotenv";
import { PrismaClient } from "@prisma/client";
import { newId } from "../../src/app/lib/new-id";
import {
  flattenExamQuestion,
  flattenLocale,
  flattenSentence,
  flattenTodayQuestion,
  normalizeChoices,
  todayChoiceList,
  type SentenceKey,
} from "../../src/app/lib/content-shape";

config({ path: ".env.local" });
config({ path: ".env" });

const prisma = new PrismaClient();
const CHUNK = 200;

type AnyRecord = Record<string, any>;

function asObject(value: unknown): AnyRecord | null {
  if (value == null) return null;
  if (typeof Buffer !== "undefined" && Buffer.isBuffer(value)) {
    value = value.toString("utf8");
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed || trimmed === "null") return null;
    try {
      return JSON.parse(trimmed);
    } catch {
      return null;
    }
  }
  if (typeof value === "object") return value as AnyRecord;
  return null;
}

function asList(value: unknown): unknown[] {
  const parsed = Array.isArray(value) ? value : asObject(value);
  return Array.isArray(parsed) ? parsed : [];
}

async function fetchRows(sql: string) {
  return prisma.$queryRawUnsafe<AnyRecord[]>(sql);
}

async function insertRows(table: string, columns: string[], rows: unknown[][]) {
  for (let i = 0; i < rows.length; i += CHUNK) {
    const chunk = rows.slice(i, i + CHUNK);
    const placeholders = chunk.map(() => `(${columns.map(() => "?").join(",")})`).join(",");
    const sql = `INSERT INTO \`${table}\` (${columns.map((col) => `\`${col}\``).join(",")}) VALUES ${placeholders}`;
    await prisma.$executeRawUnsafe(sql, ...chunk.flat());
  }
}

async function updateById(table: string, columns: string[], rows: AnyRecord[]) {
  for (let i = 0; i < rows.length; i += 100) {
    const chunk = rows.slice(i, i + 100);
    const sets = columns
      .map((col) => {
        const cases = chunk.map(() => "WHEN ? THEN ?").join(" ");
        return `\`${col}\` = CASE \`id\` ${cases} ELSE \`${col}\` END`;
      })
      .join(", ");
    const params: unknown[] = [];
    for (const col of columns) {
      for (const row of chunk) {
        params.push(row.id, row[col] ?? null);
      }
    }
    const ids = chunk.map((row) => row.id);
    params.push(...ids);
    await prisma.$executeRawUnsafe(
      `UPDATE \`${table}\` SET ${sets} WHERE \`id\` IN (${ids.map(() => "?").join(",")})`,
      ...params
    );
  }
}

function examParent(row: AnyRecord, sentenceKeys: SentenceKey[], withOrg = false, locale = false) {
  return {
    id: row.id,
    ...flattenExamQuestion(asObject(row.question), withOrg),
    ...flattenSentence(asObject(row.sentence), sentenceKeys),
    ...(locale ? flattenLocale(asObject(row.sentence_locale), "sentence") : {}),
  };
}

function choiceRows(parentId: string, choices: unknown) {
  return normalizeChoices(asList(choices)).map((item) => [newId(), parentId, item.no, item.content]);
}

function todayChoiceRows(parentId: string, question: unknown) {
  return todayChoiceList(asObject(question)).map((content, sort) => [newId(), parentId, sort, content]);
}

function stringListRows(parentId: string, values: unknown) {
  return asList(values)
    .map((value, sort) => [newId(), parentId, sort, value == null ? "" : String(value).slice(0, 191)])
    .filter((item) => item[3] !== "");
}

function meanRows(parentId: string, values: unknown) {
  return asList(values).map((value, sort) => [newId(), parentId, sort, value == null ? "" : String(value)]);
}

async function migrateUserRoles() {
  const rows = await fetchRows("SELECT id, role FROM `user`");
  await prisma.$executeRawUnsafe("DELETE FROM `user_role`");
  const items = rows.flatMap((row) =>
    asList(row.role).map((value, sort) => [newId(), row.id, sort, value == null ? "user" : String(value).slice(0, 50)])
  );
  await insertRows("user_role", ["id", "user_id", "sort", "value"], items);
  console.log(`  user: ${rows.length} parents, ${items.length} roles`);
}

async function migrateCodeDetailLevels() {
  const rows = await fetchRows("SELECT id, levels FROM `code_detail`");
  await prisma.$executeRawUnsafe("DELETE FROM `code_detail_level`");
  const items = rows.flatMap((row) =>
    asList(row.levels)
      .map((value, sort) => [newId(), row.id, sort, value == null ? "" : String(value).slice(0, 20)])
      .filter((item) => item[3] !== "")
  );
  await insertRows("code_detail_level", ["id", "code_detail_id", "sort", "value"], items);
  console.log(`  code_detail: ${rows.length} parents, ${items.length} levels`);
}

async function migrateToday(table: string, choiceTable: string, withWordLocale: boolean) {
  const extra = withWordLocale ? ", word_locale" : "";
  const rows = await fetchRows(`SELECT id, sentence_locale, question${extra} FROM \`${table}\``);
  const parents = rows.map((row) => ({
    id: row.id,
    ...flattenLocale(asObject(row.sentence_locale), "sentence"),
    ...(withWordLocale ? flattenLocale(asObject(row.word_locale), "word") : {}),
    ...flattenTodayQuestion(asObject(row.question)),
  }));
  const columns = [
    "sentenceLocaleEn",
    "sentenceLocaleCn",
    "sentenceLocaleMy",
    "questionText",
    "questionAnswer",
  ];
  const dbColumns = [
    "sentence_locale_en",
    "sentence_locale_cn",
    "sentence_locale_my",
    "question_text",
    "question_answer",
  ];
  if (withWordLocale) {
    columns.unshift("wordLocaleEn", "wordLocaleCn", "wordLocaleMy");
    dbColumns.unshift("word_locale_en", "word_locale_cn", "word_locale_my");
  }
  await updateById(
    table,
    dbColumns,
    parents.map((row) => {
      const mapped: AnyRecord = { id: row.id };
      columns.forEach((col, idx) => {
        mapped[dbColumns[idx]] = (row as AnyRecord)[col];
      });
      return mapped;
    })
  );
  await prisma.$executeRawUnsafe(`DELETE FROM \`${choiceTable}\``);
  const children = rows.flatMap((row) => todayChoiceRows(row.id, row.question));
  await insertRows(choiceTable, ["id", "parent_id", "sort", "content"], children);
  console.log(`  ${table}: ${rows.length} parents, ${children.length} choices`);
}

async function migrateExam(
  table: string,
  choiceTable: string,
  sentenceKeys: SentenceKey[],
  withOrg = false,
  locale = false
) {
  const extra = locale ? ", sentence_locale" : "";
  const rows = await fetchRows(`SELECT id, question, sentence, choices${extra} FROM \`${table}\``);
  const parents = rows.map((row) => examParent(row, sentenceKeys, withOrg, locale));
  const dbMap: Array<[string, string]> = [
    ["questionContent", "question_content"],
    ["questionAudioLink", "question_audio_link"],
    ["questionAudioName", "question_audio_name"],
    ["questionImageLink", "question_image_link"],
    ["questionImageName", "question_image_name"],
    ["sentenceTranslation", "sentence_translation"],
  ];
  if (sentenceKeys.includes("reading")) dbMap.push(["sentenceReading", "sentence_reading"]);
  if (sentenceKeys.includes("en")) dbMap.push(["sentenceEn", "sentence_en"]);
  if (sentenceKeys.includes("cn")) dbMap.push(["sentenceCn", "sentence_cn"]);
  if (withOrg) dbMap.push(["questionContentOrg", "question_content_org"]);
  if (locale) {
    dbMap.push(
      ["sentenceLocaleEn", "sentence_locale_en"],
      ["sentenceLocaleCn", "sentence_locale_cn"],
      ["sentenceLocaleMy", "sentence_locale_my"]
    );
  }
  await updateById(
    table,
    dbMap.map(([, db]) => db),
    parents.map((row) => {
      const mapped: AnyRecord = { id: row.id };
      for (const [src, db] of dbMap) mapped[db] = (row as AnyRecord)[src];
      return mapped;
    })
  );
  await prisma.$executeRawUnsafe(`DELETE FROM \`${choiceTable}\``);
  const children = rows.flatMap((row) => choiceRows(row.id, row.choices));
  await insertRows(choiceTable, ["id", "parent_id", "no", "content"], children);
  console.log(`  ${table}: ${rows.length} parents, ${children.length} choices`);
}

async function migrateWordLists(table: string, meanTable: string, partTable: string) {
  const rows = await fetchRows(`SELECT id, means, parts FROM \`${table}\``);
  await prisma.$executeRawUnsafe(`DELETE FROM \`${meanTable}\``);
  await prisma.$executeRawUnsafe(`DELETE FROM \`${partTable}\``);
  const means = rows.flatMap((row) => meanRows(row.id, row.means));
  const parts = rows.flatMap((row) => stringListRows(row.id, row.parts));
  await insertRows(meanTable, ["id", "word_id", "sort", "value"], means);
  await insertRows(partTable, ["id", "word_id", "sort", "value"], parts);
  console.log(`  ${table}: ${rows.length} parents, ${means.length} means, ${parts.length} parts`);
}

async function main() {
  console.log("Migrating JSON columns into scalars + child tables");
  try {
    await migrateToday("grammar_today", "grammar_today_question_choice", false);
    await migrateToday("word_today", "word_today_question_choice", true);
    await migrateExam("jlpt", "jlpt_choice", ["translation"]);
    await migrateExam("jlpt_test", "jlpt_test_choice", ["translation", "reading", "en", "cn"]);
    await migrateExam("jpt", "jpt_choice", ["translation", "reading"]);
    await migrateExam("level_up", "level_up_choice", ["translation", "reading"], true, true);
    await migrateWordLists("word", "word_mean", "word_part");
    await migrateWordLists("jpt_word", "jpt_word_mean", "jpt_word_part");
    await migrateUserRoles();
    await migrateCodeDetailLevels();
    console.log("JSON split data copy finished");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
