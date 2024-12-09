import User from "@/app/models/userModel";
import connectDB from "@/app/utils/database";
import { isEmpty } from "lodash";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server"
import BoardCommunity from "@/app/models/boardCommunityModel";

export async function POST(request: NextRequest) {
  await connectDB();

  const {pageInfo, boardInfo} = await request.json();

  let resultPageInfo: Paginate = pageInfo;

  const {title, contents, email} = boardInfo;
  
  // let conditions:any = {title, contents, email};
  let conditions:any = {};

  const boardCount = await BoardCommunity.count(conditions);

  if(boardCount > 0) {
    resultPageInfo.total = boardCount;
    resultPageInfo.totalPage = Math.ceil(boardCount / resultPageInfo.pageSize);
    resultPageInfo.currentPage = resultPageInfo.currentPage;
  }

  return NextResponse.json(resultPageInfo)
}