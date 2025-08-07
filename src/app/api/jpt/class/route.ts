import Jpt from "@/app/models/jptModel";
import connectDB from "@/app/utils/database";
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  await connectDB();
  
  const searchParams = request.nextUrl.searchParams;
  
  const jptClassList = await Jpt.aggregate([
    // 1. level 공백/NULL 제거
    {
      $match: {
        level: { $nin: [null, ""] }
      }
    },

    // 2. 중복 제거
    {
      $group: {
        _id: "$level"
      }
    },

    // 3. 괄호 안 숫자 추출 및 정수화
    {
      $addFields: {
        levelNum: {
          $let: {
            vars: {
              matchObj: {
                $regexFind: {
                  input: "$_id",
                  regex: /\((\d+)\)/
                }
              }
            },
            in: {
              $cond: [
                { $ne: ["$$matchObj", null] },
                {
                  $toInt: {
                    $trim: {
                      input: "$$matchObj.match",
                      chars: "()"
                    }
                  }
                },
                null
              ]
            }
          }
        },
        hasNumber: {
          $let: {
            vars: {
              matchObj: {
                $regexFind: {
                  input: "$_id",
                  regex: /\((\d+)\)/
                }
              }
            },
            in: { $ne: ["$$matchObj", null] }
          }
        }
      }
    },

    // 4. 올바른 정렬 적용
    {
      $sort: {
        hasNumber: -1,     // 괄호 있는 항목 먼저
        levelNum: -1       // 숫자 큰 순서대로
      }
    },

    // 5. 정렬된 level 값만 추출
    {
      $project: {
        _id: 0,
        level: "$_id"
      }
    },

    // 6. 순서를 유지하며 배열화 (중복 제거 완료된 상태이므로 $push 사용)
    {
      $group: {
        _id: null,
        levelArr: { $push: "$level" }
      }
    },

    {
      $project: {
        _id: 0,
        levelArr: 1
      }
    }
  ])

  return NextResponse.json(jptClassList)
}