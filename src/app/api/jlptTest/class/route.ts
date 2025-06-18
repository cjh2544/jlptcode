import JlptTest from "@/app/models/jlptTestModel";
import connectDB from "@/app/utils/database";
import { sortBy } from "lodash";
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  await connectDB();
  
  const searchParams = request.nextUrl.searchParams;
  
  const jlptTestClassInfo = await JlptTest.aggregate([
    // STEP 1: 정렬용 필드 생성
    {
      $addFields: {
        testType: {
          $cond: [
            { $regexMatch: { input: "$test", regex: /^test/ } },
            "test",
            "study"
          ]
        },
        testNumber: {
          $toInt: {
            $getField: {
              field: "match",
              input: {
                $arrayElemAt: [
                  { $regexFindAll: { input: "$test", regex: /\d+/ } },
                  0
                ]
              }
            }
          }
        },
        classificationOrder: {
          $indexOfArray: [
            ["vocabulary", "grammar", "reading", "listening"],
            "$classification"
          ]
        },
        testTypeOrder: {
          $cond: [
            { $eq: [{ $substrBytes: ["$test", 0, 4] }, "test"] },
            0,
            1
          ]
        }
      }
    },

    // STEP 2: classificationNm 매핑 추가
    {
      $addFields: {
        classificationNm: {
          $switch: {
            branches: [
              {
                case: { $eq: ["$classification", "vocabulary"] },
                then: "[ 문자어휘 / 文字語彙 / Vocabulary ]"
              },
              {
                case: { $eq: ["$classification", "grammar"] },
                then: "[ 문법 / 文法 / Grammar ]"
              },
              {
                case: { $eq: ["$classification", "reading"] },
                then: "[ 독해 / 読解 / Reading ]"
              },
              {
                case: { $eq: ["$classification", "listening"] },
                then: "[ 청해 / 聴解 / Listening ]"
              }
            ],
            default: ""
          }
        }
      }
    },

    // STEP 3: 중복 제거
    {
      $group: {
        _id: {
          level: "$level",
          classification: "$classification",
          classificationNm: "$classificationNm",
          test: "$test",
          testTypeOrder: "$testTypeOrder",
          testNumber: "$testNumber",
          classificationOrder: "$classificationOrder"
        }
      }
    },

    // STEP 4: 정렬
    {
      $sort: {
        "_id.level": 1,
        "_id.classificationOrder": 1,
        "_id.testTypeOrder": 1,
        "_id.testNumber": 1
      }
    },

    // STEP 5: classification 단위로 test 모으기
    {
      $group: {
        _id: {
          level: "$_id.level",
          classification: "$_id.classification",
          classificationNm: "$_id.classificationNm",
          classificationOrder: "$_id.classificationOrder"
        },
        years: { $push: "$_id.test" }
      }
    },

    // STEP 6: level 단위로 classifications 모으기
    {
      $group: {
        _id: "$_id.level",
        classifications: {
          $push: {
            classification: "$_id.classification",
            classificationNm: "$_id.classificationNm",
            classificationOrder: "$_id.classificationOrder",
            years: "$years"
          }
        }
      }
    },

    // STEP 7: classifications 배열 정렬
    {
      $addFields: {
        classifications: {
          $sortArray: {
            input: "$classifications",
            sortBy: { classificationOrder: 1 }
          }
        }
      }
    },

    // STEP 8: 최종 출력 포맷 정리
    {
      $project: {
        _id: 0,
        level: "$_id",
        classifications: {
          $map: {
            input: "$classifications",
            as: "c",
            in: {
              classification: "$$c.classification",
              classificationNm: "$$c.classificationNm",
              years: "$$c.years"
            }
          }
        }
      }
    },

    // STEP 9: level 정렬
    {
      $sort: { level: 1 }
    }
  ]);

  return NextResponse.json(jlptTestClassInfo)
}