import TodayKangi from "@/app/models/todayKangiModel";
import connectDB from "@/app/utils/database";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await connectDB();

  const conditions = await request.json();
  const { level } = conditions.params || {};

  const questionList = await TodayKangi.aggregate([
    { $match: { level } },
    { $sample: { size: 1 } },
  ]);

  return NextResponse.json(questionList);
}
