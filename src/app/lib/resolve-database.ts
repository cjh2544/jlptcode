import {
  DATABASE_COOKIE,
  databaseTypeFromEnv,
  parseDatabaseType,
  type DatabaseType,
} from "@/app/lib/database-type";

export async function resolveDatabaseType(): Promise<DatabaseType> {
  try {
    const { cookies } = await import("next/headers");
    const store = await cookies();
    const fromCookie = parseDatabaseType(store.get(DATABASE_COOKIE)?.value);
    if (fromCookie) return fromCookie;
  } catch {
    /* scripts / non-request context */
  }
  return databaseTypeFromEnv();
}

export async function isMongoDb() {
  return (await resolveDatabaseType()) === "mongodb";
}
