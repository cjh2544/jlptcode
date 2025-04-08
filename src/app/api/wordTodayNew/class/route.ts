import WordToday from "@/app/models/wordTodayModel";
import connectDB from "@/app/utils/database";
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  await connectDB();
  
  const searchParams = request.nextUrl.searchParams;
  
  const levelList = await WordToday.aggregate([
    {
      $match: {
        level: { $nin: ['N6'] }
      },
    },
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