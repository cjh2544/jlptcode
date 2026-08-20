import { getMongoDb } from "@/app/lib/mongo";
import { prisma } from "@/app/lib/prisma";
import { resolveDatabaseType } from "@/app/lib/resolve-database";

const connectDB = async () => {
  if ((await resolveDatabaseType()) === "mongodb") {
    return getMongoDb();
  }
  await prisma.$connect();
  return prisma;
};

export default connectDB;
