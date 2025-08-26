import Word from "@/app/models/jptWordModel";
import connectDB from "@/app/utils/database";
import { isEmpty, unset } from "lodash";
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  await connectDB();
  
  const {pageInfo, searchInfo} = await request.json();

  const { wordType } = searchInfo;

  if(isEmpty(searchInfo.parts)) {
    unset(searchInfo, 'parts');
  }

  unset(searchInfo, 'wordType');
  unset(searchInfo, 'wordShowType');

  let wordList:any = [];
  let wordSearchInfo = {};

  unset(searchInfo, 'year');
  
  wordList = await Word.find(searchInfo)
    .sort({ read: 1 })
    .limit(pageInfo.pageSize * 1)
    .skip((pageInfo.currentPage - 1) * pageInfo.pageSize)
    .exec();

  return NextResponse.json(wordList)
}