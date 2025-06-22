import User from "@/app/models/userModel";
import connectDB from "@/app/utils/database";
import { isEmpty } from "lodash";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  await connectDB();

  const {pageInfo, searchInfo} = await request.json();
  
  const { keyword } = searchInfo;
  
  const page = pageInfo.currentPage;           // 페이지 번호
  const limit = pageInfo.pageSize;         // 한 페이지 당 문서 수
  const skip = (page - 1) * limit;

  const pipeline:any = [
    // 1. keyword 검색: name 또는 email
    ...(keyword
      ? [{
          $match: {
            $or: [
              { name: { $regex: keyword, $options: 'i' } },
              { email: { $regex: keyword, $options: 'i' } }
            ]
          }
        }]
      : []),

    // 2. userPayment 조인
    {
      $lookup: {
        from: 'user_payment',
        localField: 'email',
        foreignField: 'email',
        as: 'paymentInfo'
      }
    },

    // 3. 단일 paymentInfo 객체로
    {
      $addFields: {
        paymentInfo: {
          $ifNull: [{ $arrayElemAt: ['$paymentInfo', 0] }, {}]
        }
      }
    },

    // 4. payments 배열이 null인 경우 대비
    {
      $addFields: {
        paymentsArray: { $ifNull: ['$paymentInfo.payments', []] }
      }
    },

    // 5. lastPayment 추출
    {
      $addFields: {
        lastPayment: {
          $cond: [
            { $gt: [{ $size: '$paymentsArray' }, 0] },
            { $arrayElemAt: ['$paymentsArray', -1] },
            null
          ]
        }
      }
    },

    // 6. lastPayment 기준 isValid 계산 (오늘 날짜가 범위 안에 있는지)
    {
      $addFields: {
        isValid: {
          $cond: [
            {
              $and: [
                { $lte: ['$lastPayment.startDate', '$$NOW'] },
                { $gte: ['$lastPayment.endDate', '$$NOW'] }
              ]
            },
            true,
            false
          ]
        }
      }
    },

    // 7. 필요한 필드 선택
    {
      $project: {
        _id: 0,
        email: 1,
        name: 1,
        createdAt: 1,
        updatedAt: 1,
        lastPayment: 1,
        isValid: 1
      }
    },

    // 8. 정렬 + 페이징
    { $sort: { createdAt: -1, updatedAt: -1 } },
    { $skip: skip },
    { $limit: limit }
  ];

  const userList = await User.aggregate(pipeline);
  
  return NextResponse.json(userList)
}