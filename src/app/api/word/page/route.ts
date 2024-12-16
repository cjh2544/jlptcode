import Word from "@/app/models/wordModel";
import connectDB from "@/app/utils/database";
import { isEmpty, unset } from "lodash";
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  await connectDB();
  
  const {pageInfo, searchInfo} = await request.json();

  let resultPageInfo: Paginate = pageInfo;

  if(isEmpty(searchInfo.parts)) {
    unset(searchInfo, 'parts');
  }

  const boardCount = await Word.count(searchInfo);

  if(boardCount > 0) {
    resultPageInfo.total = boardCount;
    resultPageInfo.totalPage = Math.ceil(boardCount / resultPageInfo.pageSize);
    resultPageInfo.currentPage = resultPageInfo.currentPage;
  }

  return NextResponse.json(resultPageInfo)
}
