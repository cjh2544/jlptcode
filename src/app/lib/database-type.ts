export type DatabaseType = "mysql" | "mongodb";

export function parseDatabaseType(value?: string | null): DatabaseType | null {
  const raw = String(value || "")
    .toLowerCase()
    .trim();
  if (raw === "mongodb" || raw === "mongo") return "mongodb";
  if (raw === "mysql" || raw === "mariadb" || raw === "maria") return "mysql";
  return null;
}

export function getDatabaseType(): DatabaseType {
  return parseDatabaseType(process.env.DATABASE_TYPE || process.env.DATABASE) || "mysql";
}

export function isMongoDb() {
  return getDatabaseType() === "mongodb";
}

export function getMongoUrl() {
  return process.env.MONGODB_URL || process.env.MONGODB_URI || process.env.MONGO_COPY_URL || "";
}
