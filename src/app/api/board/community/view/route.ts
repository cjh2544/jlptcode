import User from "@/app/models/userModel";
import connectDB from "@/app/utils/database";
import { isEmpty } from "lodash";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server"
import BoardCommunity from "@/app/models/boardCommunityModel";

export async function POST(request: NextRequest) {
  await connectDB();

  const {boardInfo} = await request.json();
  
  // const {title, contents, email} = boardInfo;
  const searchInfo: any = {};

  const resultBoardInfo = await BoardCommunity.findOne({_id: boardInfo._id});

  return NextResponse.json(resultBoardInfo)
}