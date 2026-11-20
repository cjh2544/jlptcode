import TodaySpeak from "@/app/models/todaySpeakModel";
import connectDB from "@/app/utils/database";
import { NextResponse } from "next/server";

export async function POST() {
  await connectDB();

  const questionList = await TodaySpeak.aggregate([
    { $match: {} },
    { $sample: { size: 1 } },
  ]);

  return NextResponse.json(questionList);
}
