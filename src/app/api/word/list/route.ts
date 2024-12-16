import User from "@/app/models/userModel";
import Word from "@/app/models/wordModel";
import connectDB from "@/app/utils/database";
import { isEmpty, unset } from "lodash";
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  await connectDB();
  
  const {pageInfo, searchInfo} = await request.json();

  if(isEmpty(searchInfo.parts)) {
    unset(searchInfo, 'parts');
  }

  const wordList = await Word.find(searchInfo)
    .limit(pageInfo.pageSize * 1)
    .skip((pageInfo.currentPage - 1) * pageInfo.pageSize)
    .exec();

  return NextResponse.json(wordList)
}