import Word from "@/app/models/jptWordModel";
import connectDB from "@/app/utils/database";
import { isEmpty, unset } from "lodash";
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  await connectDB();
  
  const {pageInfo, searchInfo} = await request.json();

  let resultPageInfo: Paginate = pageInfo;

  let wordCount = 0;

  wordCount = await Word.count(searchInfo);
  
  resultPageInfo.total = wordCount;
  resultPageInfo.totalPage = Math.ceil(wordCount / resultPageInfo.pageSize);
  resultPageInfo.currentPage = resultPageInfo.currentPage;

  return NextResponse.json(resultPageInfo)
}
