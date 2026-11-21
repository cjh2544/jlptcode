import { prisma } from "@/app/lib/prisma";
import connectDB from "@/app/utils/database";
import { NextResponse } from "next/server";

/** JLPT N1→N5 순서 (엑셀 today_kangi level 값 기준) */
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
    distinct: ["level"],
    select: { level: true },
    where: {
      NOT: { OR: [{ level: "" }] },
    },
  });

  const levels = sortJlptLevels(
    rows.map((row) => row.level).filter((level): level is string => Boolean(level)),
  );

  return NextResponse.json([{ _id: 0, levels }]);
}
