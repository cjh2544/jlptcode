/**
 * Targeted sync: MongoDB -> MariaDB (user + board only)
 * - Reads Mongo with find() only
 * - Upserts parent rows to keep existing records current
 * - Rebuilds child rows (roles/payment items/replies) from Mongo snapshot
 */
import { config } from "dotenv";
import { MongoClient, ObjectId } from "mongodb";
import { PrismaClient } from "@prisma/client";
import { newId } from "../../src/app/lib/new-id";

config({ path: ".env.local" });
config({ path: ".env" });

const MONGO_COPY_URL = process.env.MONGO_COPY_URL || "";
const CHUNK = 200;

if (!MONGO_COPY_URL) {
  throw new Error("MONGO_COPY_URL is required.");
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

function userRoleCreates(userId: string, roles: unknown) {
  const list = Array.isArray(roles) && roles.length ? roles : ["user"];
  return list.map((value, sort) => ({
    id: newId(),
    userId,
    sort,
    value: String(value ?? "user").slice(0, 50),
  }));
}

async function findAll(db: ReturnType<MongoClient["db"]>, names: string[]) {
  for (const name of names) {
    const exists = await db.listCollections({ name }).hasNext();
    if (exists) return db.collection(name).find({}).toArray();
  }
  console.warn(`skip: none of [${names.join(", ")}] exist`);
  return [];
}

async function eachChunk<T>(rows: T[], run: (chunk: T[]) => Promise<void>) {
  for (let i = 0; i < rows.length; i += CHUNK) {
    await run(rows.slice(i, i + CHUNK));
  }
}

async function main() {
  const mongo = new MongoClient(MONGO_COPY_URL, { readPreference: "secondaryPreferred" });
  await mongo.connect();
  const db = mongo.db();
  console.log(`Syncing user/board from Mongo db="${db.databaseName}" to MariaDB`);

  const users = await findAll(db, ["user"]);
  const userDocs = Array.from(
    users.reduce((acc, doc) => {
      const email = asString(doc.email, "") || "";
      if (!email) return acc;
      const prev = acc.get(email);
      const prevTime = asDate(prev?.updatedAt)?.getTime() || 0;
      const curTime = asDate(doc.updatedAt)?.getTime() || 0;
      if (!prev || curTime >= prevTime) acc.set(email, doc);
      return acc;
    }, new Map<string, any>()).values(),
  );
  const userIdByEmail = new Map<string, string>();
  await eachChunk(userDocs, async (chunk) => {
    await Promise.all(
      chunk.map(async (doc) => {
        const mongoId = asId(doc._id);
        const email = asString(doc.email, "") || "";
        if (!email) return;

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
          await prisma.user.update({
            where: { email },
            data: {
              name: asString(doc.name, "") || "",
              password: asString(doc.password, null),
              image: asString(doc.image, null),
              provider: asString(doc.provider, "credentials") || "credentials",
              updatedAt: asDate(doc.updatedAt) ?? new Date(),
            },
          });
          userIdByEmail.set(email, existing.id);
          return;
        }

        if (!mongoId) return;
        try {
          const created = await prisma.user.create({
            data: {
              id: mongoId,
              name: asString(doc.name, "") || "",
              email,
              password: asString(doc.password, null),
              image: asString(doc.image, null),
              provider: asString(doc.provider, "credentials") || "credentials",
              createdAt: asDate(doc.createdAt) ?? new Date(),
              updatedAt: asDate(doc.updatedAt) ?? new Date(),
            },
          });
          userIdByEmail.set(email, created.id);
        } catch (error: any) {
          if (error?.code !== "P2002") throw error;
          const rows = await prisma.$queryRaw<Array<{ id: string }>>`
            SELECT id FROM user WHERE LOWER(email) = LOWER(${email}) LIMIT 1
          `;
          if (!rows[0]?.id) throw error;
          await prisma.user.update({
            where: { id: rows[0].id },
            data: {
              name: asString(doc.name, "") || "",
              password: asString(doc.password, null),
              image: asString(doc.image, null),
              provider: asString(doc.provider, "credentials") || "credentials",
              updatedAt: asDate(doc.updatedAt) ?? new Date(),
            },
          });
          userIdByEmail.set(email, rows[0].id);
        }
      }),
    );
  });
  console.log(`user: ${userDocs.length}`);

  await prisma.userRole.deleteMany();
  const userRoles = userDocs.flatMap((doc) => {
    const email = asString(doc.email, "") || "";
    const userId = userIdByEmail.get(email);
    if (!userId) return [];
    return userRoleCreates(userId, doc.role);
  });
  await eachChunk(userRoles, async (chunk) => {
    await prisma.userRole.createMany({ data: chunk, skipDuplicates: true });
  });
  console.log(`user_role: ${userRoles.length}`);

  const payments = await findAll(db, ["user_payment"]);
  const paymentDocs = Array.from(
    payments.reduce((acc, doc) => {
      const email = asString(doc.email, "") || "";
      if (!email) return acc;
      const prev = acc.get(email);
      const prevTime = asDate(prev?.updatedAt)?.getTime() || 0;
      const curTime = asDate(doc.updatedAt)?.getTime() || 0;
      if (!prev || curTime >= prevTime) acc.set(email, doc);
      return acc;
    }, new Map<string, any>()).values(),
  );
  const paymentIdByEmail = new Map<string, string>();
  await eachChunk(paymentDocs, async (chunk) => {
    await Promise.all(
      chunk.map(async (doc) => {
        const mongoId = asId(doc._id);
        const email = asString(doc.email, "") || "";
        if (!email) return;

        const existing = await prisma.userPayment.findUnique({ where: { email } });
        if (existing) {
          await prisma.userPayment.update({
            where: { email },
            data: { updatedAt: asDate(doc.updatedAt) ?? new Date() },
          });
          paymentIdByEmail.set(email, existing.id);
          return;
        }

        if (!mongoId) return;
        try {
          const created = await prisma.userPayment.create({
            data: {
              id: mongoId,
              email,
              createdAt: asDate(doc.createdAt) ?? new Date(),
              updatedAt: asDate(doc.updatedAt) ?? new Date(),
            },
          });
          paymentIdByEmail.set(email, created.id);
        } catch (error: any) {
          if (error?.code !== "P2002") throw error;
          const rows = await prisma.$queryRaw<Array<{ id: string }>>`
            SELECT id FROM user_payment WHERE LOWER(email) = LOWER(${email}) LIMIT 1
          `;
          if (!rows[0]?.id) throw error;
          await prisma.userPayment.update({
            where: { id: rows[0].id },
            data: { updatedAt: asDate(doc.updatedAt) ?? new Date() },
          });
          paymentIdByEmail.set(email, rows[0].id);
        }
      }),
    );
  });
  console.log(`user_payment: ${paymentDocs.length}`);

  await prisma.userPaymentItem.deleteMany();
  const paymentItems = paymentDocs.flatMap((doc) => {
    const email = asString(doc.email, "") || "";
    const userPaymentId = paymentIdByEmail.get(email);
    if (!userPaymentId) return [];
    return (doc.payments || []).map((item: Record<string, unknown>) => ({
      id: asId(item._id) || asId(new ObjectId()) || newId(),
      userPaymentId,
      paymentType: asString(item.paymentType, "M") || "M",
      startDate: asDate(item.startDate) ?? new Date(),
      endDate: asDate(item.endDate) ?? new Date(),
      createdAt: asDate(item.createdAt) ?? new Date(),
      updatedAt: asDate(item.updatedAt) ?? new Date(),
    }));
  });
  await eachChunk(paymentItems, async (chunk) => {
    await prisma.userPaymentItem.createMany({ data: chunk, skipDuplicates: true });
  });
  console.log(`user_payment_item: ${paymentItems.length}`);

  const boards = await findAll(db, ["board_community", "boardCommunity"]);
  await eachChunk(boards, async (chunk) => {
    await Promise.all(
      chunk.map(async (doc) => {
        const id = asId(doc._id);
        if (!id) return;
        await prisma.boardCommunity.upsert({
          where: { id },
          create: {
            id,
            name: asString(doc.name, "") || "",
            email: asString(doc.email, "") || "",
            title: asString(doc.title, "") || "",
            contents: asString(doc.contents, "") || "",
            noticeYn: asString(doc.noticeYn, "N") || "N",
            createdAt: asDate(doc.createdAt) ?? new Date(),
            updatedAt: asDate(doc.updatedAt) ?? new Date(),
          },
          update: {
            name: asString(doc.name, "") || "",
            email: asString(doc.email, "") || "",
            title: asString(doc.title, "") || "",
            contents: asString(doc.contents, "") || "",
            noticeYn: asString(doc.noticeYn, "N") || "N",
            updatedAt: asDate(doc.updatedAt) ?? new Date(),
          },
        });
      }),
    );
  });
  console.log(`board_community: ${boards.length}`);

  const replies = await findAll(db, ["board_reply", "boardReply"]);
  await prisma.boardReply.deleteMany();
  const replyRows = replies.map((doc) => ({
    id: asId(doc._id) || newId(),
    board_id: asString(doc.board_id, "") || "",
    name: asString(doc.name, "") || "",
    email: asString(doc.email, "") || "",
    contents: asString(doc.contents, "") || "",
    createdAt: asDate(doc.createdAt) ?? new Date(),
    updatedAt: asDate(doc.updatedAt) ?? new Date(),
  }));
  await eachChunk(replyRows, async (chunk) => {
    await prisma.boardReply.createMany({ data: chunk, skipDuplicates: true });
  });
  console.log(`board_reply: ${replyRows.length}`);

  await mongo.close();
  await prisma.$disconnect();
  console.log("Targeted sync finished.");
}

main().catch(async (error) => {
  console.error(error);
  await prisma.$disconnect();
  process.exit(1);
});
