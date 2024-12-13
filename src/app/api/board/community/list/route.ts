import User from "@/app/models/userModel";
import connectDB from "@/app/utils/database";
import { isEmpty } from "lodash";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server"
import BoardCommunity from "@/app/models/boardCommunityModel";

export async function POST(request: NextRequest) {
  await connectDB();

  const {pageInfo, searchInfo} = await request.json();
  
  const { keyword } = searchInfo;
  
  let conditions:any = {};
  
  // 공지사항 조회
  conditions = { noticeYn: 'Y' };
  const communityNoticeList = await BoardCommunity.find(conditions)

  conditions = {...conditions, noticeYn: 'N' };

  if(keyword) {
    conditions = {
      ...conditions,
      $or: [ 
        { title: { $regex: keyword } },
        { contents: { $regex: keyword } }
      ],
    }
  }

  const communityList = await BoardCommunity.find(conditions)
  .limit(pageInfo.pageSize * 1)
  .skip((pageInfo.currentPage - 1) * pageInfo.pageSize)
  .sort({createdAt:-1, updatedAt:-1 })
  .exec()
  
  return NextResponse.json([...communityNoticeList, ...communityList])
}