import { MongoClient, type Db } from "mongodb";
import { getMongoUrl } from "@/app/lib/database-type";

const globalForMongo = globalThis as unknown as {
  mongoClient?: MongoClient;
  mongoDb?: Db;
  mongoPromise?: Promise<Db>;
};

export async function getMongoDb(): Promise<Db> {
  if (globalForMongo.mongoDb) return globalForMongo.mongoDb;
  if (!globalForMongo.mongoPromise) {
    const url = getMongoUrl();
    if (!url) {
      throw new Error("MONGODB_URL (or MONGODB_URI / MONGO_COPY_URL) is required when DATABASE_TYPE=mongodb.");
    }
    const client = new MongoClient(url);
    globalForMongo.mongoClient = client;
    globalForMongo.mongoPromise = client.connect().then((connected) => {
      const db = connected.db();
      globalForMongo.mongoDb = db;
      return db;
    });
  }
  return globalForMongo.mongoPromise;
}

export async function getMongoCollection(name: string) {
  const db = await getMongoDb();
  return db.collection(name);
}
