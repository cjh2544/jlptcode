/**
 * Refresh local code_detail including levels/classification.
 * Mongo is read-only.
 */
import { config } from "dotenv";
import { MongoClient, ObjectId } from "mongodb";
import { PrismaClient } from "@prisma/client";

config({ path: ".env.local" });
config({ path: ".env" });

const MONGO_COPY_URL = process.env.MONGO_COPY_URL || "";
const prisma = new PrismaClient();

function asId(value: unknown) {
  if (value instanceof ObjectId) return value.toHexString();
  return String(value);
}

async function main() {
  const mongo = new MongoClient(MONGO_COPY_URL, { readPreference: "secondaryPreferred" });
  await mongo.connect();
  const db = mongo.db();
  const docs = await db.collection("code_detail").find({}).toArray();

  await prisma.$executeRawUnsafe("DELETE FROM `code_detail`");

  for (const doc of docs) {
    const levels = Array.isArray(doc.levels) ? JSON.stringify(doc.levels) : doc.levels ? JSON.stringify(doc.levels) : null;
    await prisma.$executeRaw`
      INSERT INTO \`code_detail\`
        (\`id\`, \`code\`, \`key\`, \`value\`, \`sort\`, \`levels\`, \`classification\`, \`created_at\`, \`updated_at\`)
      VALUES (
        ${asId(doc._id)},
        ${String(doc.code ?? "")},
        ${String(doc.key ?? "")},
        ${String(doc.value ?? "")},
        ${doc.sort == null || doc.sort === "" ? null : Number.parseInt(String(doc.sort), 10)},
        ${levels},
        ${doc.classification == null || doc.classification === "" ? null : String(doc.classification)},
        ${doc.createdAt instanceof Date ? doc.createdAt : new Date()},
        ${doc.updatedAt instanceof Date ? doc.updatedAt : new Date()}
      )
    `;
  }

  const withLevels = await prisma.$queryRawUnsafe<Array<{ n: bigint }>>(
    "SELECT COUNT(*) AS n FROM `code_detail` WHERE `levels` IS NOT NULL"
  );
  console.log(`code_detail: ${docs.length}, with levels: ${withLevels[0]?.n}`);

  await mongo.close();
  await prisma.$disconnect();
}

main().catch(async (error) => {
  console.error(error.code || error.message);
  await prisma.$disconnect();
  process.exit(1);
});
