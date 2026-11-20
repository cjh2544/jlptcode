import TodaySpeak from "@/app/models/todaySpeakModel";
import connectDB from "@/app/utils/database";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();

  const count = await TodaySpeak.count({});
  return NextResponse.json([{ _id: 0, levels: ["ALL"], count }]);
}
