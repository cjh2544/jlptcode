import { prisma } from "@/app/lib/prisma";
import connectDB from "@/app/utils/database";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await connectDB();

  const conditions = await request.json();
  const { level } = conditions.params || {};

  if (!level) {
    return NextResponse.json([]);
  }

  const ids = await prisma.todayKangi.findMany({
    where: { level },
    select: { id: true },
  });

  if (!ids.length) {
    return NextResponse.json([]);
  }

  const picked = ids[Math.floor(Math.random() * ids.length)];
  const row = await prisma.todayKangi.findUnique({ where: { id: picked.id } });

  return NextResponse.json(row ? [row] : []);
}
