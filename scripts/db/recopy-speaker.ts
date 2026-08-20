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

type SpeakerTable = {
  collection: string;
  updateMany: (args: {
    where: { id: string };
    data: { speaker: string | null };
  }) => Promise<{ count: number }>;
};

const TABLES: SpeakerTable[] = [
  { collection: "word_today", updateMany: (args) => prisma.wordToday.updateMany(args) },
  { collection: "grammar_today", updateMany: (args) => prisma.grammarToday.updateMany(args) },
  { collection: "jpt", updateMany: (args) => prisma.jpt.updateMany(args) },
  { collection: "level_up", updateMany: (args) => prisma.levelUp.updateMany(args) },
];

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
      const result = await table.updateMany({
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
