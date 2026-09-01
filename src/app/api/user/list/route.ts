import User from "@/app/models/userModel";
import connectDB from "@/app/utils/database";
import {
  escapeRegex,
  normalizeAdminKeyword,
  parseAdminPageRequest,
} from "@/app/lib/admin-security";
import { requireAdmin } from "@/app/utils/requireAdmin";
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  await connectDB();

  const {pageInfo, searchInfo} = await request.json();
  
  const keyword = normalizeAdminKeyword(searchInfo?.keyword);
  const { currentPage, pageSize } = parseAdminPageRequest(pageInfo);
  const skip = (currentPage - 1) * pageSize;

  const pipeline:any = [
    ...(keyword
      ? [{
          $match: {
            $or: [
              { name: { $regex: escapeRegex(keyword), $options: 'i' } },
              { email: { $regex: escapeRegex(keyword), $options: 'i' } }
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
        role: 1,
        createdAt: 1,
        updatedAt: 1,
        lastPayment: 1,
        isValid: 1
      }
    },

    // 8. 정렬 + 페이징
    { $sort: { createdAt: -1, updatedAt: -1 } },
    { $skip: skip },
    { $limit: pageSize }
  ];

  const userList = await User.aggregate(pipeline);
  
  return NextResponse.json(userList)
}