/**
 * Read-only copy: MongoDB -> local MariaDB.
 * Uses find() only. Never drop / delete / update Mongo data.
 */
import { config } from "dotenv";
import { MongoClient, ObjectId } from "mongodb";
import { PrismaClient } from "@prisma/client";
import { newId } from "../../src/app/lib/new-id";
import {
  flattenExamQuestion,
  flattenLocale,
  flattenSentence,
  flattenTodayQuestion,
  normalizeChoices,
  todayChoiceList,
} from "../../src/app/lib/content-shape";

config({ path: ".env.local" });
config({ path: ".env" });

const MONGO_COPY_URL = process.env.MONGO_COPY_URL || "";
const CHUNK = 200;

if (!MONGO_COPY_URL) {
  throw new Error("MONGO_COPY_URL is required. App runtime does not use this URL.");
}

const prisma = new PrismaClient();

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

function choiceCreates(parentId: string, choices: unknown) {
  return normalizeChoices(choices).map((item) => ({
    id: newId(),
    parentId,
    no: item.no,
    content: item.content,
  }));
}

function todayChoiceCreates(parentId: string, question: unknown) {
  return todayChoiceList(question).map((content, sort) => ({
    id: newId(),
    parentId,
    sort,
    content,
  }));
}

function wordListCreates(parentId: string, values: unknown, maxLen?: number) {
  const list = Array.isArray(values) ? values : [];
  return list.map((value, sort) => ({
    id: newId(),
    wordId: parentId,
    sort,
    value: String(value ?? "").slice(0, maxLen ?? 100000),
  }));
}

function userRoleCreates(userId: string, roles: unknown) {
  const list = Array.isArray(roles) && roles.length ? roles : ["user"];
  return list.map((value, sort) => ({
    id: newId(),
    userId,
    sort,
    value: String(value ?? "user").slice(0, 50),
  }));
}

function codeDetailLevelCreates(codeDetailId: string, levels: unknown) {
  const list = Array.isArray(levels) ? levels : [];
  return list
    .map((value, sort) => ({
      id: newId(),
      codeDetailId,
      sort,
      value: String(value ?? "").slice(0, 20),
    }))
    .filter((item) => item.value);
}

function pick(doc: Record<string, any>, map: Record<string, (doc: Record<string, any>) => unknown>) {
  const row: Record<string, unknown> = {};
  for (const [key, getter] of Object.entries(map)) {
    const value = getter(doc);
    if (value !== undefined) row[key] = value;
  }
  return row;
}

async function findAll(db: ReturnType<MongoClient["db"]>, names: string[]) {
  for (const name of names) {
    const exists = await db.listCollections({ name }).hasNext();
    if (exists) {
      // find only — no update / delete / drop
      return db.collection(name).find({}).toArray();
    }
  }
  console.warn(`  skip: none of [${names.join(", ")}] exist`);
  return [];
}

async function insertChunks<T extends Record<string, any>>(
  label: string,
  rows: T[],
  insert: (chunk: T[]) => Promise<unknown>
) {
  let written = 0;
  for (let i = 0; i < rows.length; i += CHUNK) {
    const chunk = rows.slice(i, i + CHUNK);
    await insert(chunk);
    written += chunk.length;
  }
  console.log(`  ${label}: ${written}`);
}

async function main() {
  const mongo = new MongoClient(MONGO_COPY_URL, { readPreference: "secondaryPreferred" });
  await mongo.connect();
  const db = mongo.db();
  console.log(`Copying from Mongo db="${db.databaseName}" (read-only) -> MariaDB`);

  const users = await findAll(db, ["user"]);
  await insertChunks(
    "user",
    users.map((doc) =>
      pick(doc, {
        id: (d) => asId(d._id),
        name: (d) => d.name,
        email: (d) => d.email,
        password: (d) => d.password ?? null,
        image: (d) => d.image ?? null,
        provider: (d) => d.provider || "credentials",
        createdAt: (d) => asDate(d.createdAt) ?? new Date(),
        updatedAt: (d) => asDate(d.updatedAt) ?? new Date(),
      })
    ),
    (data) => prisma.user.createMany({ data: data as any, skipDuplicates: true })
  );
  await insertChunks(
    "user_role",
    users.flatMap((doc) => userRoleCreates(asId(doc._id)!, doc.role)),
    (data) => prisma.userRole.createMany({ data: data as any, skipDuplicates: true })
  );

  const payments = await findAll(db, ["user_payment"]);
  const paymentRows = payments.map((doc) =>
    pick(doc, {
      id: (d) => asId(d._id),
      email: (d) => d.email,
      createdAt: (d) => asDate(d.createdAt) ?? new Date(),
      updatedAt: (d) => asDate(d.updatedAt) ?? new Date(),
    })
  );
  await insertChunks("user_payment", paymentRows, (data) =>
    prisma.userPayment.createMany({ data: data as any, skipDuplicates: true })
  );

  const paymentItems = payments.flatMap((doc) =>
    (doc.payments || []).map((item: Record<string, any>) =>
      pick(item, {
        id: (d) => asId(d._id) || asId(new ObjectId()),
        userPaymentId: () => asId(doc._id),
        paymentType: (d) => d.paymentType,
        startDate: (d) => asDate(d.startDate) ?? new Date(),
        endDate: (d) => asDate(d.endDate) ?? new Date(),
        createdAt: (d) => asDate(d.createdAt) ?? new Date(),
        updatedAt: (d) => asDate(d.updatedAt) ?? new Date(),
      })
    )
  );
  await insertChunks("user_payment_item", paymentItems, (data) =>
    prisma.userPaymentItem.createMany({ data: data as any, skipDuplicates: true })
  );

  const codes = await findAll(db, ["code"]);
  await insertChunks(
    "code",
    codes.map((doc) =>
      pick(doc, {
        id: (d) => asId(d._id),
        code: (d) => asString(d.code),
        name: (d) => asString(d.name),
        sort: (d) => asInt(d.sort, null),
        createdAt: (d) => asDate(d.createdAt) ?? new Date(),
        updatedAt: (d) => asDate(d.updatedAt) ?? new Date(),
      })
    ),
    (data) => prisma.code.createMany({ data: data as any, skipDuplicates: true })
  );

  if (!process.env.COPY_ONLY || process.env.COPY_ONLY === "code_detail") {
    if (process.env.COPY_ONLY === "code_detail") {
      await prisma.codeDetail.deleteMany();
    }
    const codeDetails = await findAll(db, ["code_detail"]);
    await insertChunks(
      "code_detail",
      codeDetails.map((doc) =>
        pick(doc, {
          id: (d) => asId(d._id),
          code: (d) => asString(d.code),
          key: (d) => asString(d.key),
          value: (d) => asString(d.value),
          sort: (d) => asInt(d.sort, null),
          classification: (d) => asString(d.classification, null),
          createdAt: (d) => asDate(d.createdAt) ?? new Date(),
          updatedAt: (d) => asDate(d.updatedAt) ?? new Date(),
        })
      ),
      (data) => prisma.codeDetail.createMany({ data: data as any, skipDuplicates: true })
    );
    await insertChunks(
      "code_detail_level",
      codeDetails.flatMap((doc) => codeDetailLevelCreates(asId(doc._id)!, doc.levels)),
      (data) => prisma.codeDetailLevel.createMany({ data: data as any, skipDuplicates: true })
    );
    if (process.env.COPY_ONLY === "code_detail") {
      await mongo.close();
      await prisma.$disconnect();
      console.log("Copy finished. Mongo data was not modified.");
      return;
    }
  }

  const words = await findAll(db, ["word"]);
  await insertChunks(
    "word",
    words.map((doc) =>
      pick(doc, {
        id: (d) => asId(d._id),
        type: (d) => asString(d.type, ""),
        level: (d) => asString(d.level),
        word: (d) => asString(d.word, null),
        read: (d) => asString(d.read, ""),
        createdAt: (d) => asDate(d.createdAt) ?? new Date(),
        updatedAt: (d) => asDate(d.updatedAt) ?? new Date(),
      })
    ),
    (data) => prisma.word.createMany({ data: data as any, skipDuplicates: true })
  );
  await insertChunks(
    "word_mean",
    words.flatMap((doc) => wordListCreates(asId(doc._id)!, doc.means)),
    (data) => prisma.wordMean.createMany({ data: data as any, skipDuplicates: true })
  );
  await insertChunks(
    "word_part",
    words.flatMap((doc) => wordListCreates(asId(doc._id)!, doc.parts, 191)),
    (data) => prisma.wordPart.createMany({ data: data as any, skipDuplicates: true })
  );

  const wordToday = await findAll(db, ["word_today"]);
  await insertChunks(
    "word_today",
    wordToday.map((doc) => ({
      ...pick(doc, {
        id: (d) => asId(d._id),
        level: (d) => asString(d.level),
        year: (d) => asString(d.year, ""),
        study: (d) => asString(d.study, ""),
        day: (d) => asInt(d.day, null),
        wordNo: (d) => asInt(d.wordNo, 0),
        word: (d) => asString(d.word, ""),
        read: (d) => asString(d.read, ""),
        means: (d) => asString(d.means, ""),
        sentence: (d) => d.sentence ?? null,
        sentence_read: (d) => d.sentence_read ?? null,
        sentence_translate: (d) => d.sentence_translate ?? null,
        keyword: (d) => asString(d.keyword, null),
        speaker: (d) => asString(d.speaker, null),
        sortNo: (d) => asInt(d.sortNo, null),
        createdAt: (d) => asDate(d.createdAt) ?? new Date(),
        updatedAt: (d) => asDate(d.updatedAt) ?? new Date(),
      }),
      ...flattenLocale(doc.word_locale, "word"),
      ...flattenLocale(doc.sentence_locale, "sentence"),
      ...flattenTodayQuestion(doc.question),
    })),
    (data) => prisma.wordToday.createMany({ data: data as any, skipDuplicates: true })
  );
  await insertChunks(
    "word_today_question_choice",
    wordToday.flatMap((doc) => todayChoiceCreates(asId(doc._id)!, doc.question)),
    (data) => prisma.wordTodayQuestionChoice.createMany({ data: data as any, skipDuplicates: true })
  );

  const grammarToday = await findAll(db, ["grammar_today"]);
  await insertChunks(
    "grammar_today",
    grammarToday.map((doc) => ({
      ...pick(doc, {
        id: (d) => asId(d._id),
        level: (d) => asString(d.level),
        year: (d) => asString(d.year, ""),
        study: (d) => asString(d.study, ""),
        sortNo: (d) => asInt(d.sortNo, 0),
        sentence: (d) => d.sentence ?? null,
        sentence_read: (d) => d.sentence_read ?? null,
        sentence_translate: (d) => d.sentence_translate ?? null,
        speaker: (d) => asString(d.speaker, null),
        createdAt: (d) => asDate(d.createdAt) ?? new Date(),
        updatedAt: (d) => asDate(d.updatedAt) ?? new Date(),
      }),
      ...flattenLocale(doc.sentence_locale, "sentence"),
      ...flattenTodayQuestion(doc.question),
    })),
    (data) => prisma.grammarToday.createMany({ data: data as any, skipDuplicates: true })
  );
  await insertChunks(
    "grammar_today_question_choice",
    grammarToday.flatMap((doc) => todayChoiceCreates(asId(doc._id)!, doc.question)),
    (data) => prisma.grammarTodayQuestionChoice.createMany({ data: data as any, skipDuplicates: true })
  );

  const readingToday = await findAll(db, ["reading_today"]);
  await insertChunks(
    "reading_today",
    readingToday.map((doc) =>
      pick(doc, {
        id: (d) => asId(d._id),
        level: (d) => asString(d.level, ""),
        source: (d) => asString(d.source, ""),
        sentence: (d) => d.sentence ?? null,
        sentence_read: (d) => d.sentence_read ?? null,
        sentence_translate: (d) => d.sentence_translate ?? null,
        createdAt: (d) => asDate(d.createdAt) ?? new Date(),
        updatedAt: (d) => asDate(d.updatedAt) ?? new Date(),
      })
    ),
    (data) => prisma.readingToday.createMany({ data: data as any, skipDuplicates: true })
  );

  const jlpt = await findAll(db, ["jlpt"]);
  await insertChunks(
    "jlpt",
    jlpt.map((doc) => ({
      ...pick(doc, {
        id: (d) => asId(d._id),
        year: (d) => asString(d.year, ""),
        month: (d) => asString(d.month, ""),
        level: (d) => asString(d.level, ""),
        sortNo: (d) => asInt(d.sortNo, 0),
        classification: (d) => asString(d.classification, ""),
        questionNo: (d) => (d.questionNo == null ? null : String(d.questionNo)),
        questionType: (d) => asString(d.questionType, ""),
        answer: (d) => asInt(d.answer, null),
        createdAt: (d) => asDate(d.createdAt) ?? new Date(),
        updatedAt: (d) => asDate(d.updatedAt) ?? new Date(),
      }),
      ...flattenExamQuestion(doc.question),
      ...flattenSentence(doc.sentence, ["translation"]),
    })),
    (data) => prisma.jlpt.createMany({ data: data as any, skipDuplicates: true })
  );
  await insertChunks(
    "jlpt_choice",
    jlpt.flatMap((doc) => choiceCreates(asId(doc._id)!, doc.choices)),
    (data) => prisma.jlptChoice.createMany({ data: data as any, skipDuplicates: true })
  );

  const jlptTest = await findAll(db, ["jlpt_test"]);
  await insertChunks(
    "jlpt_test",
    jlptTest.map((doc) => ({
      ...pick(doc, {
        id: (d) => asId(d._id),
        level: (d) => asString(d.level),
        test: (d) => asString(d.test, ""),
        classification: (d) => asString(d.classification, ""),
        questionType: (d) => asString(d.questionType, ""),
        sortNo: (d) => asInt(d.sortNo, 0),
        questionNo: (d) => asInt(d.questionNo, null),
        questionNoLabel: (d) => d.questionNoLabel ?? null,
        answer: (d) => asInt(d.answer, null),
        createdAt: (d) => asDate(d.createdAt) ?? new Date(),
        updatedAt: (d) => asDate(d.updatedAt) ?? new Date(),
      }),
      ...flattenExamQuestion(doc.question),
      ...flattenSentence(doc.sentence, ["translation", "reading", "en", "cn"]),
    })),
    (data) => prisma.jlptTest.createMany({ data: data as any, skipDuplicates: true })
  );
  await insertChunks(
    "jlpt_test_choice",
    jlptTest.flatMap((doc) => choiceCreates(asId(doc._id)!, doc.choices)),
    (data) => prisma.jlptTestChoice.createMany({ data: data as any, skipDuplicates: true })
  );

  const jpt = await findAll(db, ["jpt"]);
  await insertChunks(
    "jpt",
    jpt.map((doc) => ({
      ...pick(doc, {
        id: (d) => asId(d._id),
        level: (d) => asString(d.level, null),
        part: (d) => asString(d.part, ""),
        year: (d) => asString(d.year, null),
        classification: (d) => asString(d.classification, null),
        questionGroupType: (d) => asString(d.questionGroupType, null),
        questionType: (d) => asString(d.questionType, ""),
        questionGroupNo: (d) => asInt(d.questionGroupNo, null),
        questionContentNo: (d) => asInt(d.questionContentNo, null),
        sortNo: (d) => asInt(d.sortNo, 0),
        questionNo: (d) => (d.questionNo == null ? null : String(d.questionNo)),
        answer: (d) => asInt(d.answer, null),
        speaker: (d) => asString(d.speaker, null),
        createdAt: (d) => asDate(d.createdAt) ?? new Date(),
        updatedAt: (d) => asDate(d.updatedAt) ?? new Date(),
      }),
      ...flattenExamQuestion(doc.question),
      ...flattenSentence(doc.sentence, ["translation", "reading"]),
    })),
    (data) => prisma.jpt.createMany({ data: data as any, skipDuplicates: true })
  );
  await insertChunks(
    "jpt_choice",
    jpt.flatMap((doc) => choiceCreates(asId(doc._id)!, doc.choices)),
    (data) => prisma.jptChoice.createMany({ data: data as any, skipDuplicates: true })
  );

  const jptWord = await findAll(db, ["jpt_word"]);
  await insertChunks(
    "jpt_word",
    jptWord.map((doc) =>
      pick(doc, {
        id: (d) => asId(d._id),
        type: (d) => asString(d.type, ""),
        level: (d) => asString(d.level),
        word: (d) => asString(d.word, null),
        read: (d) => asString(d.read, ""),
        createdAt: (d) => asDate(d.createdAt) ?? new Date(),
        updatedAt: (d) => asDate(d.updatedAt) ?? new Date(),
      })
    ),
    (data) => prisma.jptWord.createMany({ data: data as any, skipDuplicates: true })
  );
  await insertChunks(
    "jpt_word_mean",
    jptWord.flatMap((doc) => wordListCreates(asId(doc._id)!, doc.means)),
    (data) => prisma.jptWordMean.createMany({ data: data as any, skipDuplicates: true })
  );
  await insertChunks(
    "jpt_word_part",
    jptWord.flatMap((doc) => wordListCreates(asId(doc._id)!, doc.parts, 191)),
    (data) => prisma.jptWordPart.createMany({ data: data as any, skipDuplicates: true })
  );

  const levelUp = await findAll(db, ["level_up"]);
  await insertChunks(
    "level_up",
    levelUp.map((doc) => ({
      ...pick(doc, {
        id: (d) => asId(d._id),
        year: (d) => asString(d.year),
        level: (d) => asString(d.level),
        sortNo: (d) => asInt(d.sortNo, 0),
        classification: (d) => asString(d.classification, ""),
        questionNo: (d) => asInt(d.questionNo, null),
        questionGroupNo: (d) => asInt(d.questionGroupNo, null),
        questionContentNo: (d) => asInt(d.questionContentNo, null),
        questionGroupType: (d) => asString(d.questionGroupType, ""),
        questionType: (d) => asString(d.questionType, null),
        answer: (d) => asInt(d.answer, null),
        speaker: (d) => asString(d.speaker, null),
        createdAt: (d) => asDate(d.createdAt) ?? new Date(),
        updatedAt: (d) => asDate(d.updatedAt) ?? new Date(),
      }),
      ...flattenExamQuestion(doc.question, true),
      ...flattenSentence(doc.sentence, ["translation", "reading"]),
      ...flattenLocale(doc.sentence_locale, "sentence"),
    })),
    (data) => prisma.levelUp.createMany({ data: data as any, skipDuplicates: true })
  );
  await insertChunks(
    "level_up_choice",
    levelUp.flatMap((doc) => choiceCreates(asId(doc._id)!, doc.choices)),
    (data) => prisma.levelUpChoice.createMany({ data: data as any, skipDuplicates: true })
  );

  const boards = await findAll(db, ["board_community", "boardCommunity"]);
  await insertChunks(
    "board_community",
    boards.map((doc) =>
      pick(doc, {
        id: (d) => asId(d._id),
        name: (d) => d.name,
        email: (d) => d.email,
        title: (d) => d.title,
        contents: (d) => d.contents,
        noticeYn: (d) => d.noticeYn || "N",
        createdAt: (d) => asDate(d.createdAt) ?? new Date(),
        updatedAt: (d) => asDate(d.updatedAt) ?? new Date(),
      })
    ),
    (data) => prisma.boardCommunity.createMany({ data: data as any, skipDuplicates: true })
  );

  const replies = await findAll(db, ["board_reply", "boardReply"]);
  await insertChunks(
    "board_reply",
    replies.map((doc) =>
      pick(doc, {
        id: (d) => asId(d._id),
        board_id: (d) => String(d.board_id),
        name: (d) => d.name,
        email: (d) => d.email,
        contents: (d) => d.contents,
        createdAt: (d) => asDate(d.createdAt) ?? new Date(),
        updatedAt: (d) => asDate(d.updatedAt) ?? new Date(),
      })
    ),
    (data) => prisma.boardReply.createMany({ data: data as any, skipDuplicates: true })
  );

  await mongo.close();
  await prisma.$disconnect();
  console.log("Copy finished. Mongo data was not modified.");
}

main().catch(async (error) => {
  console.error(error);
  await prisma.$disconnect();
  process.exit(1);
});
