import JlptTest from "@/app/models/jlptTestModel";
import { isMongoDb } from "@/app/lib/database-type";
import { prisma } from "@/app/lib/prisma";
import connectDB from "@/app/utils/database";
import { NextRequest, NextResponse } from "next/server"

const CLASS_ORDER = ["vocabulary", "grammar", "reading", "listening"];
const CLASS_NM: Record<string, string> = {
  vocabulary: "[ 문자어휘 / 文字語彙 / Vocabulary ]",
  grammar: "[ 문법 / 文法 / Grammar ]",
  reading: "[ 독해 / 読解 / Reading ]",
  listening: "[ 청해 / 聴解 / Listening ]",
};

type ClassRow = {
  level?: string | null;
  classification?: string | null;
  test?: string | null;
};

function testNumber(test: string) {
  const match = String(test).match(/\d+/);
  const parsed = match ? Number.parseInt(match[0], 10) : 0;
  return Number.isNaN(parsed) ? 0 : parsed;
}

function testTypeOrder(test: string) {
  return String(test).startsWith("test") ? 0 : 1;
}

function buildClassInfo(rows: ClassRow[]) {
  const levels = new Map<string, Map<string, Set<string>>>();
  for (const row of rows) {
    if (!row.level || !row.classification || !row.test) continue;
    if (!levels.has(row.level)) levels.set(row.level, new Map());
    const classes = levels.get(row.level)!;
    if (!classes.has(row.classification)) classes.set(row.classification, new Set());
    classes.get(row.classification)!.add(row.test);
  }

  return [...levels.keys()].sort().map((level) => {
    const classMap = levels.get(level)!;
    const classifications = [
      ...CLASS_ORDER.filter((key) => classMap.has(key)),
      ...[...classMap.keys()].filter((key) => !CLASS_ORDER.includes(key)),
    ].map((classification) => ({
      classification,
      classificationNm: CLASS_NM[classification] || "",
      years: [...classMap.get(classification)!].sort((a, b) => {
        const typeDiff = testTypeOrder(a) - testTypeOrder(b);
        if (typeDiff) return typeDiff;
        return testNumber(a) - testNumber(b) || a.localeCompare(b);
      }),
    }));
    return { level, classifications };
  });
}

async function loadClassRows(level?: string | null) {
  if (isMongoDb()) {
    const grouped = await JlptTest.aggregate([
      ...(level ? [{ $match: { level } }] : []),
      {
        $group: {
          _id: {
            level: "$level",
            classification: "$classification",
            test: "$test",
          },
        },
      },
    ]);
    return grouped.map((row: { _id?: ClassRow }) => row._id || {});
  }

  return prisma.jlptTest.findMany({
    where: level ? { level } : {},
    distinct: ["level", "classification", "test"],
    select: { level: true, classification: true, test: true },
  });
}

export async function GET(request: NextRequest) {
  await connectDB();
  const level = request.nextUrl.searchParams.get("level")?.trim();
  const rows = await loadClassRows(level || null);
  return NextResponse.json(buildClassInfo(rows));
}
