import WordToday from "@/app/models/wordTodayModel";
import connectDB from "@/app/utils/database";
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  await connectDB();
  
  const conditions = await request.json();
  const { levels } = conditions.params || {}
  
  let levelUpList: any[] = [];

  // 조회 문제 수
  let questionSize:any = {
    N0: 10,
    N1: 10,
    N2: 10,
    N3: 10,
    N4: 10,
    N5: 10
  }

  let resultData: any[] = [];

  // 1. 문제 랜덤 조회
  let questionList = await WordToday.aggregate([
    { $match: { level: { $in: levels } } },
    { $sample: { size : 10 } }
  ]);
  
  return NextResponse.json(questionList)
}