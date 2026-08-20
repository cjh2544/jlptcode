import { config } from "dotenv";
import { PrismaClient } from "@prisma/client";

config({ path: ".env" });
config({ path: ".env.local" });

const appUrl = process.env.DATABASE_URL || "";
const infoUrl = appUrl.replace(/\/jlptcode(\?.*)?$/, "/information_schema$1");

async function main() {
  const prisma = new PrismaClient({ datasources: { db: { url: infoUrl } } });
  try {
    const schemas = await prisma.$queryRawUnsafe<Array<{ SCHEMA_NAME: string }>>(
      "SELECT SCHEMA_NAME FROM information_schema.SCHEMATA"
    );
    const names = schemas.map((row) => row.SCHEMA_NAME);
    if (names.includes("jlptcode")) {
      console.log("Database jlptcode is visible");
      return;
    }
    console.error("Database jlptcode is missing.");
    console.error("Run scripts/db/000_create_database.sql as a MariaDB admin, then npm run db:schema");
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error.code || error.message);
  process.exit(1);
});
