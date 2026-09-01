import { prisma } from "@/app/lib/prisma";
import {
  buildLevelUpJlptMap,
  type LevelUpJlptMap,
} from "@/app/lib/levelUpJlptMap";

const mapCache = new Map<string, LevelUpJlptMap>();

export async function getLevelUpJlptMap(level: string): Promise<LevelUpJlptMap> {
  const cached = mapCache.get(level);
  if (cached) return cached;

  const [testRows, yearRows] = await Promise.all([
    prisma.jlptTest.findMany({
      where: { level },
      distinct: ["test"],
      select: { test: true },
    }),
    prisma.levelUp.findMany({
      where: { level, year: { contains: "(" } },
      distinct: ["year"],
      select: { year: true },
    }),
  ]);

  const map = buildLevelUpJlptMap(
    testRows.map((row) => row.test),
    yearRows.map((row) => row.year),
  );
  mapCache.set(level, map);
  return map;
}

export async function resolveLevelUpStudyRound(level: string, year: string) {
  if (year === "random") return "random";
  if (!year.includes("(")) return "";
  const { yearToTest } = await getLevelUpJlptMap(level);
  return yearToTest[year] ?? "";
}

export async function resolveLevelUpYearFromStudyRound(
  level: string,
  studyRound: string,
) {
  if (studyRound === "random") return "random";
  const { testToYear } = await getLevelUpJlptMap(level);
  return testToYear[studyRound] ?? "";
}

export async function resolveYearsFromStudyRound(studyRound: string) {
  if (studyRound === "random") return ["random"];

  const levels = await prisma.levelUp.findMany({
    distinct: ["level"],
    select: { level: true },
    orderBy: { level: "asc" },
  });

  const years = new Set<string>();
  for (const { level } of levels) {
    const year = await resolveLevelUpYearFromStudyRound(level, studyRound);
    if (year) years.add(year);
  }
  return [...years];
}

export async function resolveLevelUpAdminSearch(
  searchInfo?: Record<string, string | undefined>,
) {
  const studyRound = searchInfo?.studyRound?.trim();
  if (!studyRound) {
    return { searchInfo: searchInfo ?? {}, extraClauses: [] as Record<string, unknown>[] };
  }

  const next = { ...searchInfo };
  delete next.studyRound;

  const level = searchInfo?.level?.trim();
  if (level) {
    const year = await resolveLevelUpYearFromStudyRound(level, studyRound);
    if (year) next.year = year;
    else return { searchInfo: next, extraClauses: [{ year: "__NO_MATCH__" }] };
    return { searchInfo: next, extraClauses: [] };
  }

  const years = await resolveYearsFromStudyRound(studyRound);
  if (!years.length) {
    return { searchInfo: next, extraClauses: [{ year: "__NO_MATCH__" }] };
  }
  return {
    searchInfo: next,
    extraClauses: [{ year: years.length === 1 ? years[0] : { $in: years } }],
  };
}

export async function enrichLevelUpRows<T extends { level?: string | null; year?: string | null }>(
  rows: T[],
) {
  const mapByLevel = new Map<string, LevelUpJlptMap>();

  return Promise.all(
    rows.map(async (row) => {
      const level = row.level ?? "";
      const year = row.year ?? "";
      if (!level || !year) return { ...row, studyRound: "" };

      if (year === "random") return { ...row, studyRound: "random" };
      if (!year.includes("(")) return { ...row, studyRound: "" };

      let map = mapByLevel.get(level);
      if (!map) {
        map = await getLevelUpJlptMap(level);
        mapByLevel.set(level, map);
      }

      return { ...row, studyRound: map.yearToTest[year] ?? "" };
    }),
  );
}
