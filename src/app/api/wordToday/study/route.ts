import LevelUp from "@/app/models/levelUpModel";
import WordToday from "@/app/models/wordTodayModel";
import connectDB from "@/app/utils/database";
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  await connectDB();
  
  const searchParams = request.nextUrl.searchParams;
  const ignoreLevels = searchParams.get('ignoreLevels');
  
  const studyList = await WordToday.aggregate([
    {
      $match: {
        level: { $nin: ignoreLevels?.split(',') }
      },
    },
    { 
      '$group' : {
        _id: {
          level: '$level',
          study: '$study'
        },
        // 'studys' : {'$addToSet' : '$study'}
      }
    },
    // {
    //   $project: {
    //     level: '$_id.level',
    //     studys: {'$addToSet' : '$study'}
    //   }
    // },
    { $sort: { level: 1 } },
    // {
    //   $set: {
    //     studys: {
    //       $sortArray: {
    //         input: '$studys',
    //         sortBy: { level: 1 }
    //       }
    //     }
    //   }
    // },
  ])
console.log(studyList);
  return NextResponse.json(studyList)
}
