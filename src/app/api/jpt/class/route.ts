import Jpt from "@/app/models/jptModel";
import { isMongoDb } from "@/app/lib/database-type";
import { prisma } from "@/app/lib/prisma";
import connectDB from "@/app/utils/database";
import { NextRequest, NextResponse } from "next/server"

function parenNum(level: string) {
  const match = String(level).match(/\((\d+)\)/);
  if (!match) return null;
  const parsed = Number.parseInt(match[1], 10);
  return Number.isNaN(parsed) ? null : parsed;
}

function sortJptLevels(levels: string[]) {
  return [...levels].sort((a, b) => {
    const numA = parenNum(a);
    const numB = parenNum(b);
    const hasA = numA != null ? 1 : 0;
    const hasB = numB != null ? 1 : 0;
    if (hasA !== hasB) return hasB - hasA;
    if (numA != null && numB != null && numA !== numB) return numB - numA;
    return a.localeCompare(b);
  });
}

async function loadLevels() {
  if (isMongoDb()) {
    const grouped = await Jpt.aggregate([
      { $match: { level: { $nin: [null, ""] } } },
      { $group: { _id: "$level" } },
    ]);
    return grouped.map((row: { _id?: string }) => row._id).filter(Boolean) as string[];
  }

  const rows = await prisma.jpt.findMany({
    where: {
      NOT: {
        OR: [{ level: null }, { level: "" }],
      },
    },
    distinct: ["level"],
    select: { level: true },
  });
  return rows.map((row) => row.level).filter((level): level is string => Boolean(level));
}

export async function GET(_request: NextRequest) {
  await connectDB();
  const levelArr = sortJptLevels(await loadLevels());
  return NextResponse.json([{ levelArr }]);
}
