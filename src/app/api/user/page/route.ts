import connectDB from "@/app/utils/database";
import { isEmpty } from "lodash";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server"
import User from "@/app/models/userModel";

export async function POST(request: NextRequest) {
  await connectDB();

  const {pageInfo, searchInfo} = await request.json();

  let resultPageInfo: Paginate = pageInfo;
  
  const {keyword} = searchInfo;
  
  let conditions:any = {};

  if(keyword) {
    conditions = {
      ...conditions,
      $or: [ 
        { name: { $regex: keyword } },
        { email: { $regex: keyword } }
      ],
    }
  }


  const userCount = await User.count(conditions);

  resultPageInfo.total = userCount;
  resultPageInfo.totalPage = Math.ceil(userCount / resultPageInfo.pageSize);
  resultPageInfo.currentPage = resultPageInfo.currentPage;

  return NextResponse.json(resultPageInfo)
}