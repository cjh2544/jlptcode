import TodaySpeak from "@/app/models/todaySpeakModel";
import connectDB from "@/app/utils/database";
import { NextResponse } from "next/server";

export async function POST() {
  await connectDB();

  const list = await TodaySpeak.find({}).sort({ sortNo: 1 });
  return NextResponse.json(list);
}
