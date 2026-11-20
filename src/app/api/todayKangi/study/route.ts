import TodayKangi from "@/app/models/todayKangiModel";
import connectDB from "@/app/utils/database";
import { NextResponse } from "next/server";

const DAY_SIZE = 10;

export async function GET() {
  await connectDB();

  const levelRows = await TodayKangi.aggregate([
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

  const levels: string[] = levelRows[0]?.levels || [];
  const studyList = [];

  for (const level of levels) {
    const count = await TodayKangi.count({ level });
    const days = Math.ceil(Number(count || 0) / DAY_SIZE);
    studyList.push({
      level,
      count,
      studies: Array.from({ length: days }, (_, idx) => String(idx + 1)),
    });
  }

  return NextResponse.json(studyList);
}
