/**
 * Recopy word_today.sentence_locale_* from Mongo (read-only).
 */
import { config } from "dotenv";
import { MongoClient, ObjectId } from "mongodb";
import { PrismaClient } from "@prisma/client";
import { flattenLocale } from "../../src/app/lib/content-shape";

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

async function coverage() {
  const rows = await prisma.$queryRawUnsafe<
    Array<{ total: bigint; with_en: bigint; null_en: bigint }>
  >(`
    SELECT
      COUNT(*) AS total,
      SUM(CASE WHEN sentence_locale_en IS NOT NULL AND sentence_locale_en <> '' THEN 1 ELSE 0 END) AS with_en,
      SUM(CASE WHEN sentence_locale_en IS NULL OR sentence_locale_en = '' THEN 1 ELSE 0 END) AS null_en
    FROM word_today
  `);
  return {
    total: Number(rows[0]?.total ?? 0),
    with_en: Number(rows[0]?.with_en ?? 0),
    null_en: Number(rows[0]?.null_en ?? 0),
  };
}

async function main() {
  if (!MONGO_COPY_URL) {
    throw new Error("MONGO_COPY_URL (or MONGODB_URL) is required.");
  }

  const before = await coverage();
  console.log("MariaDB before:", before);

  const mongo = new MongoClient(MONGO_COPY_URL, { readPreference: "secondaryPreferred" });
  await mongo.connect();
  const docs = await mongo
    .db()
    .collection("word_today")
    .find(
      { sentence_locale: { $exists: true, $ne: null } },
      { projection: { sentence_locale: 1 } }
    )
    .toArray();

  const rows = docs
    .map((doc) => {
      const locale = flattenLocale(doc.sentence_locale, "sentence");
      if (!locale.sentenceLocaleEn && !locale.sentenceLocaleCn && !locale.sentenceLocaleMy) {
        return null;
      }
      return {
        id: asId(doc._id),
        sentenceLocaleEn: locale.sentenceLocaleEn,
        sentenceLocaleCn: locale.sentenceLocaleCn,
        sentenceLocaleMy: locale.sentenceLocaleMy,
      };
    })
    .filter((row): row is NonNullable<typeof row> => row != null);

  let updated = 0;
  for (let i = 0; i < rows.length; i += CHUNK) {
    const chunk = rows.slice(i, i + CHUNK);
    const result = await prisma.$transaction(
      chunk.map((row) =>
        prisma.wordToday.updateMany({
          where: { id: row.id },
          data: {
            sentenceLocaleEn: row.sentenceLocaleEn,
            sentenceLocaleCn: row.sentenceLocaleCn,
            sentenceLocaleMy: row.sentenceLocaleMy,
          },
        })
      )
    );
    updated += result.reduce((sum, item) => sum + item.count, 0);
    console.log(`  ${Math.min(i + CHUNK, rows.length)}/${rows.length}`);
  }

  const after = await coverage();
  console.log("Mongo source with sentence_locale:", docs.length, "with values:", rows.length);
  console.log("updated:", updated);
  console.log("MariaDB after:", after);

  await mongo.close();
  await prisma.$disconnect();
}

main().catch(async (error) => {
  console.error(error);
  await prisma.$disconnect();
  process.exit(1);
});
