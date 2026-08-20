import { PrismaClient } from "@prisma/client";
import { newId } from "../../src/app/lib/new-id";

const prisma = new PrismaClient();

type Row = { id: string; role?: unknown; levels?: unknown };

function parseArray(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

async function main() {
  const users = await prisma.$queryRawUnsafe<Row[]>("SELECT id, role FROM `user`");
  await prisma.userRole.deleteMany({});
  await prisma.userRole.createMany({
    data: users.flatMap((user) => {
      const roles = parseArray(user.role);
      const normalized = roles.length ? roles : ["user"];
      return normalized.map((value, sort) => ({
        id: newId(),
        userId: user.id,
        sort,
        value: String(value ?? "user").slice(0, 50),
      }));
    }),
  });

  const codeDetails = await prisma.$queryRawUnsafe<Row[]>("SELECT id, levels FROM `code_detail`");
  await prisma.codeDetailLevel.deleteMany({});
  await prisma.codeDetailLevel.createMany({
    data: codeDetails.flatMap((detail) =>
      parseArray(detail.levels)
        .map((value, sort) => ({
          id: newId(),
          codeDetailId: detail.id,
          sort,
          value: String(value ?? "").slice(0, 20),
        }))
        .filter((item) => item.value)
    ),
  });

  console.log(`user_role=${await prisma.userRole.count()} code_detail_level=${await prisma.codeDetailLevel.count()}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
