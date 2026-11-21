import { prisma } from "@/app/lib/prisma";
import connectDB from "@/app/utils/database";
import { NextResponse } from "next/server";

const DAY_SIZE = 10;

function sortJlptLevels(levels: string[]) {
  return [...levels].sort((a, b) => {
    const numA = Number.parseInt(String(a).replace(/\D/g, ""), 10);
    const numB = Number.parseInt(String(b).replace(/\D/g, ""), 10);
    const hasA = Number.isFinite(numA);
    const hasB = Number.isFinite(numB);
    if (hasA && hasB && numA !== numB) return numA - numB;
    return String(a).localeCompare(String(b));
  });
}

export async function GET() {
  await connectDB();

  const grouped = await prisma.todayKangi.groupBy({
    by: ["level"],
    _count: { _all: true },
  });

  const levels = sortJlptLevels(grouped.map((row) => row.level));
  const countByLevel = new Map(
    grouped.map((row) => [row.level, row._count._all]),
  );

  const studyList = levels.map((level) => {
    const count = countByLevel.get(level) ?? 0;
    const days = Math.ceil(count / DAY_SIZE);
    return {
      level,
      count,
      studies: Array.from({ length: days }, (_, idx) => String(idx + 1)),
    };
  });

  return NextResponse.json(studyList);
}
