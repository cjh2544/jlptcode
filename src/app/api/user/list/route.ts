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

  // const userList = await User.aggregate([
  //   // 1. 검색 조건 추가 (이 부분 중요!)
  //   {
  //     $match: {
  //       $or: [
  //         { name: { $regex: matchStage, $options: 'i' } },     // 대소문자 무시
  //         { email: { $regex: matchStage, $options: 'i' } }
  //       ]
  //     }
  //   },

  //   // 2. userpayment 조인
  //   {
  //     $lookup: {
  //       from: "userPayment",
  //       localField: "email",
  //       foreignField: "email",
  //       as: "paymentInfo"
  //     }
  //   },

  //   // 3. 조인 결과 평탄화
  //   {
  //     $unwind: {
  //       path: "$paymentInfo",
  //       preserveNullAndEmptyArrays: true
  //     }
  //   },

  //   // 4. 마지막 결제 내역 추출
  //   {
  //     $addFields: {
  //       lastPayment: { $arrayElemAt: ["$paymentInfo.payments", -1] }
  //     }
  //   },

  //   // 5. 필요한 필드만 반환
  //   {
  //     $project: {
  //       _id: 0,
  //       email: 1,
  //       name: 1,
  //       createdAt: 1,
  //       updatedAt: 1,
  //       lastPayment: 1
  //     }
  //   },

  //   // 6. 정렬, 페이징
  //   { $sort: { createdAt: -1, updatedAt: -1 } },
  //   { $skip: (pageInfo.currentPage - 1) * pageInfo.pageSize },
  //   { $limit: pageInfo.pageSize * 1 }
  // ]);
  
  return NextResponse.json(userList)
}