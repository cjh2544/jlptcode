import Word from "@/app/models/jptWordModel";
import connectDB from "@/app/utils/database";
import { isEmpty, unset } from "lodash";
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  await connectDB();
  
  const {pageInfo, searchInfo} = await request.json();

  const { wordType } = searchInfo;

  let resultPageInfo: Paginate = pageInfo;

  if(isEmpty(searchInfo.parts)) {
    unset(searchInfo, 'parts');
  }

  unset(searchInfo, 'wordType');
  unset(searchInfo, 'wordShowType');

  let wordCount = 0;
  let wordSearchInfo = {};
  
  if(wordType === '1') {
    unset(searchInfo, 'year');
  } else {
    unset(searchInfo, 'parts');
    unset(searchInfo, 'type');

    if(isEmpty(searchInfo.year)) {
      unset(searchInfo, 'year');
    }

    wordSearchInfo = {...searchInfo, level: 'N' + searchInfo.level }
  }

  wordCount = await Word.count(searchInfo);
  
  resultPageInfo.total = wordCount;
  resultPageInfo.totalPage = Math.ceil(wordCount / resultPageInfo.pageSize);
  resultPageInfo.currentPage = resultPageInfo.currentPage;
  
  return NextResponse.json(resultPageInfo)
}
