import { prisma } from "@/app/lib/prisma";
import connectDB from "@/app/utils/database";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await connectDB();

  const conditions = await request.json();
  const { level, study } = conditions.params || {};
  const sortNo = Number(String(study ?? "").replace(/\D/g, ""));

  if (!level || !Number.isFinite(sortNo) || sortNo < 1) {
    return NextResponse.json([]);
  }

  const row = await prisma.todayKangi.findFirst({
    where: { level, sortNo },
  });

  return NextResponse.json(row ? [row] : []);
}
