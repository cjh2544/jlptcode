import { getMongoDb } from "@/app/lib/mongo";
import { getDatabaseType } from "@/app/lib/database-type";
import { prisma } from "@/app/lib/prisma";

const connectDB = async () => {
  if (getDatabaseType() === "mongodb") {
    return getMongoDb();
  }
  await prisma.$connect();
  return prisma;
};

export default connectDB;
