import connectDB from "@/app/utils/database";
import { escapeRegex, normalizeAdminKeyword, parseAdminPageRequest } from "@/app/lib/admin-security";
import { requireAdmin } from "@/app/utils/requireAdmin";
import { NextRequest, NextResponse } from "next/server"
import User from "@/app/models/userModel";

export async function POST(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  await connectDB();

  const {pageInfo, searchInfo} = await request.json();
  const pagination = parseAdminPageRequest(pageInfo);
  const resultPageInfo: Paginate = { ...pageInfo, ...pagination };

  const keyword = normalizeAdminKeyword(searchInfo?.keyword);
  
  let conditions:any = {};

  if(keyword) {
    const pattern = escapeRegex(keyword);
    conditions = {
      ...conditions,
      $or: [ 
        { name: { $regex: pattern, $options: "i" } },
        { email: { $regex: pattern, $options: "i" } }
      ],
    }
  }


  const userCount = await User.count(conditions);

  resultPageInfo.total = userCount;
  resultPageInfo.totalPage = Math.ceil(userCount / pagination.pageSize) || 1;
  resultPageInfo.currentPage = Math.min(
    pagination.currentPage,
    resultPageInfo.totalPage,
  );
  resultPageInfo.pageSize = pagination.pageSize;

  return NextResponse.json(resultPageInfo)
}