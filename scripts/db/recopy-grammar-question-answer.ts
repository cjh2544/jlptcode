/**
 * Recopy grammar_today.question_answer from Mongo (read-only).
 * Mongo stores the correct choice on the document root as `answer`, not question.answer.
 */
import { config } from "dotenv";
import { MongoClient, ObjectId } from "mongodb";
import { PrismaClient } from "@prisma/client";

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
  return String(value);
}

function asAnswer(value: unknown) {
  if (value == null || value === "") return null;
  const parsed = Number.parseInt(String(value), 10);
  return Number.isNaN(parsed) ? null : parsed;
}

async function main() {
  if (!MONGO_COPY_URL) {
    throw new Error("MONGO_COPY_URL (or MONGODB_URL) is required.");
  }

  const mongo = new MongoClient(MONGO_COPY_URL, { readPreference: "secondaryPreferred" });
  await mongo.connect();
  const db = mongo.db();
  const docs = await db.collection("grammar_today").find({}, { projection: { answer: 1 } }).toArray();

  const rows = docs
    .map((doc) => ({ id: asId(doc._id), questionAnswer: asAnswer(doc.answer) }))
    .filter((row) => row.questionAnswer != null);

  let updated = 0;
  for (let i = 0; i < rows.length; i += CHUNK) {
    const chunk = rows.slice(i, i + CHUNK);
    const result = await prisma.$transaction(
      chunk.map((row) =>
        prisma.grammarToday.updateMany({
          where: { id: row.id },
          data: { questionAnswer: row.questionAnswer },
        })
      )
    );
    updated += result.reduce((sum, item) => sum + item.count, 0);
    console.log(`  ${Math.min(i + CHUNK, rows.length)}/${rows.length}`);
  }

  const after = await prisma.$queryRawUnsafe<
    Array<{ total: bigint; with_answer: bigint; null_answer: bigint }>
  >(`
    SELECT
      COUNT(*) AS total,
      SUM(CASE WHEN question_answer IS NOT NULL THEN 1 ELSE 0 END) AS with_answer,
      SUM(CASE WHEN question_answer IS NULL THEN 1 ELSE 0 END) AS null_answer
    FROM grammar_today
  `);

  console.log("Mongo source:", docs.length, "with answer:", rows.length);
  console.log("updated:", updated);
  console.log("MariaDB after:", {
    total: Number(after[0]?.total ?? 0),
    with_answer: Number(after[0]?.with_answer ?? 0),
    null_answer: Number(after[0]?.null_answer ?? 0),
  });

  await mongo.close();
  await prisma.$disconnect();
}

main().catch(async (error) => {
  console.error(error);
  await prisma.$disconnect();
  process.exit(1);
});
