import User from "@/app/models/userModel";
import connectDB from "@/app/utils/database";
import { isEmpty } from "lodash";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server"
import BoardCommunity from "@/app/models/boeadCommunityModel";

// export async function GET(request: NextRequest) {
//   await connectDB();

//   const searchParams = request.nextUrl.searchParams;
  
//   const title = searchParams.get('title');
//   const contents = searchParams.get('contents');
//   const email = searchParams.get('email');
//   const limit = Number(searchParams.get('limit')) || 20;
//   const page = Number(searchParams.get('page') || 1);
  
//   let pageInfo: Paginate = {
//     total: 0, 
//     totalPage: 1, 
//     currentPage: 1, 
//     startPage: 1, 
//     pageSize: 1,
//   };

//   let conditions:any = {title, contents, email};

//   if(part) {
//     conditions = {...conditions, parts: [part] };
//   }

//   const boardCount = await BoardCommunity.count(conditions);

//   if(boardCount > 0) {
//     pageInfo.total = boardCount;
//     pageInfo.totalPage = Math.ceil(boardCount / limit);
//     pageInfo.currentPage = page;

    

//     pageInfo.pageSize = 10;
//   }

//   return NextResponse.json(pageInfo)
// }

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