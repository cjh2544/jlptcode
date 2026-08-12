import User from "@/app/models/userModel";
import connectDB from "@/app/utils/database";
import { isEmpty } from "lodash";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server"
import BoardCommunity from "@/app/models/boardCommunityModel";

export async function POST(request: NextRequest) {
  await connectDB();

  const {pageInfo, searchInfo} = await request.json();

  let resultPageInfo: Paginate = pageInfo;
  
  const {keyword} = searchInfo;
  
  let conditions:any = { noticeYn: 'N' };

  if(keyword) {
    conditions = {
      ...conditions,
      $or: [ 
        { title: { $regex: keyword } },
        { contents: { $regex: keyword } }
      ],
    }
  }


  const boardCount = await BoardCommunity.count(conditions);

  const pageSize = Math.max(Number(resultPageInfo.pageSize) || 10, 1);
  const totalPage = Math.max(Math.ceil(boardCount / pageSize), 1);
  let currentPage = Number(resultPageInfo.currentPage) || 1;
  if (currentPage > totalPage) currentPage = totalPage;
  if (currentPage < 1) currentPage = 1;

  resultPageInfo = {
    ...resultPageInfo,
    pageSize,
    total: boardCount,
    totalPage,
    currentPage,
  };

  return NextResponse.json(resultPageInfo)
}