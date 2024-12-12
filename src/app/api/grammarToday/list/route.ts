import GrammarToday from "@/app/models/grammarTodayModel";
import connectDB from "@/app/utils/database";
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  await connectDB();
  
  const conditions = await request.json();
  const {level} = conditions.params || {}

  // 조회 문제 수
  let questionSize:any = {
    N1: 10,
    N2: 10,
    N3: 10,
    N4: 10,
    N5: 10
  }

  // 1. 문제 랜덤 조회
  let questionList = await GrammarToday.aggregate([
    { $match: {level} },
    { $sample: { size : questionSize[level] } }
  ]);
  
  return NextResponse.json(questionList)
}