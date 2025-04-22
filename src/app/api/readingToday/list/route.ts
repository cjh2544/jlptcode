import ReadingToday from "@/app/models/readingTodayModel";
import connectDB from "@/app/utils/database";
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  await connectDB();
  
  const conditions = await request.json();
  const {level} = conditions.params || {}
  
  let levelUpList: any[] = [];

  // 조회 문제 수
  let questionSize:any = {
    N0: 1,
    N1: 1,
    N2: 1,
    N3: 1,
    N4: 1,
    N5: 1
  }

  let resultData: any[] = [];

  // 1. 문제 랜덤 조회
  let questionList = await ReadingToday.aggregate([
    { $match: {level} },
    { $sample: { size : questionSize[level] } }
  ]);
  
  return NextResponse.json(questionList)
}