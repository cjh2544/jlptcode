/**
 * Recopy speaker URLs from Mongo (read-only) after widening the column.
 */
import { config } from "dotenv";
import { MongoClient, ObjectId } from "mongodb";
import { PrismaClient } from "@prisma/client";

config({ path: ".env.local" });
config({ path: ".env" });

const MONGO_COPY_URL = process.env.MONGO_COPY_URL || "";
const prisma = new PrismaClient();

const TABLES = [
  { collection: "word_today", delegate: () => prisma.wordToday },
  { collection: "grammar_today", delegate: () => prisma.grammarToday },
  { collection: "jpt", delegate: () => prisma.jpt },
  { collection: "level_up", delegate: () => prisma.levelUp },
] as const;

function asId(value: unknown) {
  if (value instanceof ObjectId) return value.toHexString();
  return String(value);
}

async function main() {
  if (!MONGO_COPY_URL) {
    throw new Error("MONGO_COPY_URL is required.");
  }

  const mongo = new MongoClient(MONGO_COPY_URL, { readPreference: "secondaryPreferred" });
  await mongo.connect();
  const db = mongo.db();

  for (const table of TABLES) {
    const docs = await db.collection(table.collection).find({}, { projection: { speaker: 1 } }).toArray();
    let updated = 0;
    for (const doc of docs) {
      const speaker = doc.speaker == null || doc.speaker === "" ? null : String(doc.speaker);
      const result = await table.delegate().updateMany({
        where: { id: asId(doc._id) },
        data: { speaker },
      });
      updated += result.count;
    }
    console.log(`${table.collection}: ${docs.length} source, ${updated} updated`);
  }

  await mongo.close();
  await prisma.$disconnect();
}

main().catch(async (error) => {
  console.error(error);
  await prisma.$disconnect();
  process.exit(1);
});
