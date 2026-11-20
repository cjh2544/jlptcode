import TodayKangi from "@/app/models/todayKangiModel";
import connectDB from "@/app/utils/database";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();

  const levelList = await TodayKangi.aggregate([
    {
      $group: {
        _id: 0,
        levels: { $addToSet: "$level" },
      },
    },
    {
      $set: {
        levels: {
          $sortArray: {
            input: "$levels",
            sortBy: 1,
          },
        },
      },
    },
  ]);

  return NextResponse.json(levelList);
}
