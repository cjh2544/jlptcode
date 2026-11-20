import TodayKangi from "@/app/models/todayKangiModel";
import connectDB from "@/app/utils/database";
import { NextRequest, NextResponse } from "next/server";

const DAY_SIZE = 10;

export async function POST(request: NextRequest) {
  await connectDB();

  const conditions = await request.json();
  const { level, study } = conditions.params || {};
  const day = Number(String(study ?? "").replace(/\D/g, ""));

  if (!level || !Number.isFinite(day) || day < 1) {
    return NextResponse.json([]);
  }

  const skip = (day - 1) * DAY_SIZE;
  const list = await TodayKangi.find({ level })
    .sort({ sortNo: 1 })
    .skip(skip)
    .limit(DAY_SIZE);

  return NextResponse.json(list);
}
