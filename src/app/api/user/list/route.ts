import User from "@/app/models/userModel";
import connectDB from "@/app/utils/database";
import { isEmpty } from "lodash";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  await connectDB();

  const {pageInfo, searchInfo} = await request.json();
  
  const { keyword } = searchInfo;
  
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

  const userList = await User.find(conditions)
  .limit(pageInfo.pageSize * 1)
  .skip((pageInfo.currentPage - 1) * pageInfo.pageSize)
  .sort({createdAt:-1, updatedAt:-1 })
  .exec()
  
  return NextResponse.json(userList)
}