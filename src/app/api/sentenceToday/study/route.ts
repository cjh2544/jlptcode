import LevelUp from "@/app/models/levelUpModel";
import WordToday from "@/app/models/wordTodayModel";
import connectDB from "@/app/utils/database";
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  await connectDB();
  
  const searchParams = request.nextUrl.searchParams;
  const ignoreLevels = searchParams.get('ignoreLevels');
  
  const studyList = await WordToday.aggregate([
    {
      $match: {
        level: { $nin: ignoreLevels?.split(',') }
      },
    },
    // 1. 숫자 문자열 추출
    {
      $addFields: {
        studyDigits: {
          $arrayElemAt: [
            {
              $regexFindAll: {
                input: "$study",
                regex: "\\d+"
              }
            },
            0
          ]
        }
      }
    },
    // 2. 숫자로 변환
    {
      $addFields: {
        studyNumber: {
          $toInt: "$studyDigits.match"
        }
      }
    },
    // 3. 중복 제거 위해 study + number 조합을 기준으로 그룹화
    {
      $group: {
        _id: {
          level: "$level",
          study: "$study"
        },
        studyNumber: { $first: "$studyNumber" }
      }
    },
    // 4. 다시 level별로 그룹화하며 정렬용 number 유지
    {
      $group: {
        _id: "$_id.level",
        studies: {
          $push: {
            study: "$_id.study",
            number: "$studyNumber"
          }
        }
      }
    },
    // 5. 정렬 및 number 제거
    {
      $project: {
        studies: {
          $map: {
            input: {
              $sortArray: {
                input: "$studies",
                sortBy: { number: 1 }
              }
            },
            as: "s",
            in: "$$s.study"
          }
        }
      }
    },
    // 6. 결과 필드 정리
    {
      $project: {
        level: "$_id",
        studies: 1,
        _id: 0
      }
    },
    // 7. level 오름차순 정렬
    {
      $sort: { level: 1 }
    }
  ])

  return NextResponse.json(studyList)
}
