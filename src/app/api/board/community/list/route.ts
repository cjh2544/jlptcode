import User from "@/app/models/userModel";
import connectDB from "@/app/utils/database";
import { isEmpty } from "lodash";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server"
import BoardCommunity from "@/app/models/boardCommunityModel";

export async function POST(request: NextRequest) {
  await connectDB();

  const {pageInfo, boardInfo} = await request.json();
  
  // const {title, contents, email} = boardInfo;
  const searchInfo: any = {};

  const communityList = await BoardCommunity.find()
  .limit(pageInfo.pageSize * 1)
  .skip((pageInfo.currentPage - 1) * pageInfo.pageSize)
  .sort({createdAt:-1, updatedAt:-1 })
  .exec()
  
  return NextResponse.json(communityList)
}