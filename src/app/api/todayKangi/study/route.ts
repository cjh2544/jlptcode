import { prisma } from "@/app/lib/prisma";
import connectDB from "@/app/utils/database";
import { NextResponse } from "next/server";

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

  const rows = await prisma.todayKangi.findMany({
    select: { level: true, sortNo: true },
    orderBy: [{ level: "asc" }, { sortNo: "asc" }],
  });

  const byLevel = new Map<string, number[]>();
  for (const row of rows) {
    if (!row.level || row.sortNo == null) continue;
    const list = byLevel.get(row.level) ?? [];
    list.push(row.sortNo);
    byLevel.set(row.level, list);
  }

  const studyList = sortJlptLevels([...byLevel.keys()]).map((level) => {
    const sortNos = [...new Set(byLevel.get(level) ?? [])].sort((a, b) => a - b);
    return {
      level,
      count: sortNos.length,
      studies: sortNos.map((n) => String(n)),
    };
  });

  return NextResponse.json(studyList);
}
