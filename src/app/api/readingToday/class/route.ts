import ReadingToday from "@/app/models/readingTodayModel";
import connectDB from "@/app/utils/database";
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  await connectDB();
  
  const searchParams = request.nextUrl.searchParams;

  const levelList = await ReadingToday.aggregate([
    { 
      '$group' : {
        _id: 0,
        'levels' : {'$addToSet' : '$level'}
      }
    },
    {
      $set: {
        levels: {
          $sortArray: {
            input: '$levels',
            sortBy: 1
          }
        }
      }
    },
  ])

  return NextResponse.json(levelList)
}
