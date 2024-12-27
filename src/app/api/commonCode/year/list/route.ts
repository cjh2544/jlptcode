import Code from "@/app/models/codeModel";
import GrammarToday from "@/app/models/grammarTodayModel";
import WordToday from "@/app/models/wordTodayModel";
import connectDB from "@/app/utils/database";
import { cloneDeep, result } from "lodash";
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  await connectDB();
  
  const { codeList } = await request.json();

  let result: any = [];

  // 기출 단어 출제년도 코드
  if(codeList.includes('word')) {
    const result1 = await WordToday.aggregate([
      { 
        $group: { 
          _id: '$level',
          years: { $addToSet: '$year' }
        }
      },
      { $project:
        {
          _id: 0,
          level: '$_id',
          wordType: "2",
          name: "기출단어",
          details: {
            $sortArray: { input: "$years", sortBy: -1 }
          }
        }
      },
      {
        $sort: { level: 1 }
      }
    ]);

    result = [...result, ...result1];
  }

  // 기출 문장 출제년도 코드
  if(codeList.includes('sentence')) {
    const result2 = await WordToday.aggregate([
      { 
        $group: { 
          _id: '$level',
          years: { $addToSet: '$year' }
        }
      },
      { $project:
        {
          _id: 0,
          level: '$_id',
          wordType: "3",
          name: '기출문장',
          details: {
            $sortArray: { input: "$years", sortBy: -1 }
          }
        }
      },
      {
        $sort: { level: 1 }
      }
    ]);

    result = [...result, ...result2];
  }
  
  // 기출 문법 출제년도 코드
  if(codeList.includes('grammar')) {
    const result3 = await GrammarToday.aggregate([
      { 
        $group: { 
          _id: '$level',
          years: { $addToSet: '$year' }
        }
      },
      { $project:
        {
          _id: 0,
          level: '$_id',
          wordType: "4",
          name: "기출문장(문법)",
          details: {
            $sortArray: { input: "$years", sortBy: -1 }
          }
        }
      },
      {
        $sort: { level: 1 }
      }
    ]);

    result = [...result, ...result3];
  }
  
  return NextResponse.json(result)
}