import LevelUp from "@/app/models/levelUpModel";
import WordToday from "@/app/models/wordTodayModel";
import connectDB from "@/app/utils/database";
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  await connectDB();
  
  const conditions = await request.json();
  const {level, study} = conditions.params || {}


  // 1. 단어 조회
  let wordList = await WordToday.find({level, study}).sort({ [level === 'N6' ? 'wordNo' : 'sortNo']: 1});
  
  return NextResponse.json(wordList)
}