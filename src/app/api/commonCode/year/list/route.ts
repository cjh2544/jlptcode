import Code from "@/app/models/codeModel";
import GrammarToday from "@/app/models/grammarTodayModel";
import WordToday from "@/app/models/wordTodayModel";
import LevelUpNew from "@/app/models/levelUpNewModel";
import connectDB from "@/app/utils/database";
import { cloneDeep, result } from "lodash";
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  await connectDB();
  
  const { codeList } = await request.json();

  let result: any = [];

  // 기출 단어 출제년도 코드
  if(codeList.includes('word')) {
    // const result1 = await WordToday.aggregate([
    //   { 
    //     $group: { 
    //       _id: '$level',
    //       years: { $addToSet: '$year' }
    //     }
    //   },
    //   { $project:
    //     {
    //       _id: 0,
    //       level: '$_id',
    //       wordType: "2",
    //       name: "기출단어",
    //       details: {
    //         $sortArray: { input: "$years", sortBy: -1 }
    //       }
    //     }
    //   },
    //   {
    //     $sort: { level: 1 }
    //   }
    // ]);

    const result1 = await WordToday.aggregate([
      {
        $addFields: {
          studyNumeric: {
            $toInt: {
              $ifNull: [
                {
                  $arrayElemAt: [
                    {
                      $map: {
                        input: { $regexFindAll: { input: "$study", regex: "\\d+" } },
                        as: "match",
                        in: "$$match.match"
                      }
                    },
                    0
                  ]
                },
                0
              ]
            }
          }
        }
      },
      {
        $sort: {
          level: 1,
          studyNumeric: 1
        }
      },
      {
        $group: {
          _id: {
            level: "$level",
            study: "$study"
          },
          studyNumeric: { $first: "$studyNumeric" }
        }
      },
      {
        $sort: {
          "_id.level": 1,
          studyNumeric: 1
        }
      },
      {
        $group: {
          _id: "$_id.level",
          details: { $push: "$_id.study" }
        }
      },
      {
        $project: {
          _id: 0,
          level: "$_id",
          wordType: "2",
          name: "기출단어",
          details: 1
        }
      }
    ]);

    result = [...result, ...result1];
  }

  // 기출 문장 출제년도 코드
  if(codeList.includes('sentence')) {
    // const result2 = await WordToday.aggregate([
    //   { 
    //     $group: { 
    //       _id: '$level',
    //       years: { $addToSet: '$year' }
    //     }
    //   },
    //   { $project:
    //     {
    //       _id: 0,
    //       level: '$_id',
    //       wordType: "3",
    //       name: '기출문장',
    //       details: {
    //         $sortArray: { input: "$years", sortBy: -1 }
    //       }
    //     }
    //   },
    //   {
    //     $sort: { level: 1 }
    //   }
    // ]);

    const result2 = await WordToday.aggregate([
      {
        $addFields: {
          studyNumeric: {
            $toInt: {
              $ifNull: [
                {
                  $arrayElemAt: [
                    {
                      $map: {
                        input: { $regexFindAll: { input: "$study", regex: "\\d+" } },
                        as: "match",
                        in: "$$match.match"
                      }
                    },
                    0
                  ]
                },
                0
              ]
            }
          }
        }
      },
      {
        $sort: {
          level: 1,
          studyNumeric: 1
        }
      },
      {
        $group: {
          _id: {
            level: "$level",
            study: "$study"
          },
          studyNumeric: { $first: "$studyNumeric" }
        }
      },
      {
        $sort: {
          "_id.level": 1,
          studyNumeric: 1
        }
      },
      {
        $group: {
          _id: "$_id.level",
          details: { $push: "$_id.study" }
        }
      },
      {
        $project: {
          _id: 0,
          level: "$_id",
          wordType: "3",
          name: "기출문장",
          details: 1
        }
      }
    ]);

    result = [...result, ...result2];
  }
  
  // 기출 문법 출제년도 코드
  if(codeList.includes('grammar')) {
    // const result3 = await GrammarToday.aggregate([
    //   { 
    //     $group: { 
    //       _id: '$level',
    //       years: { $addToSet: '$year' }
    //     }
    //   },
    //   { $project:
    //     {
    //       _id: 0,
    //       level: '$_id',
    //       wordType: "4",
    //       name: "기출문장(문법)",
    //       details: {
    //         $sortArray: { input: "$years", sortBy: -1 }
    //       }
    //     }
    //   },
    //   {
    //     $sort: { level: 1 }
    //   }
    // ]);

    const result3 = await GrammarToday.aggregate([
      {
        $addFields: {
          studyNumeric: {
            $toInt: {
              $ifNull: [
                {
                  $arrayElemAt: [
                    {
                      $map: {
                        input: { $regexFindAll: { input: "$study", regex: "\\d+" } },
                        as: "match",
                        in: "$$match.match"
                      }
                    },
                    0
                  ]
                },
                0
              ]
            }
          }
        }
      },
      {
        $sort: {
          level: 1,
          studyNumeric: 1
        }
      },
      {
        $group: {
          _id: {
            level: "$level",
            study: "$study"
          },
          studyNumeric: { $first: "$studyNumeric" }
        }
      },
      {
        $sort: {
          "_id.level": 1,
          studyNumeric: 1
        }
      },
      {
        $group: {
          _id: "$_id.level",
          details: { $push: "$_id.study" }
        }
      },
      {
        $project: {
          _id: 0,
          level: "$_id",
          wordType: "4",
          name: "기출문장(문법)",
          details: 1
        }
      }
    ]);

    result = [...result, ...result3];
  }

  // 기출 단어 출제년도 코드
  if(codeList.includes('strategy')) {
    // const result4 = await LevelUpNew.aggregate([
    //   { 
    //     $group: { 
    //       _id: '$level',
    //       years: { $addToSet: '$year' }
    //     }
    //   },
    //   { $project:
    //     {
    //       _id: 0,
    //       level: '$_id',
    //       wordType: "2",
    //       name: "집중공략",
    //       details: {
    //         $sortArray: { input: "$years", sortBy: -1 }
    //       }
    //     }
    //   },
    //   {
    //     $sort: { level: 1 }
    //   }
    // ]);

    const result4 = await LevelUpNew.aggregate([
      {
        $addFields: {
          studyNumeric: {
            $toInt: {
              $ifNull: [
                {
                  $arrayElemAt: [
                    {
                      $map: {
                        input: { $regexFindAll: { input: "$study", regex: "\\d+" } },
                        as: "match",
                        in: "$$match.match"
                      }
                    },
                    0
                  ]
                },
                0
              ]
            }
          }
        }
      },
      {
        $sort: {
          level: 1,
          studyNumeric: 1
        }
      },
      {
        $group: {
          _id: {
            level: "$level",
            study: "$study"
          },
          studyNumeric: { $first: "$studyNumeric" }
        }
      },
      {
        $sort: {
          "_id.level": 1,
          studyNumeric: 1
        }
      },
      {
        $group: {
          _id: "$_id.level",
          details: { $push: "$_id.study" }
        }
      },
      {
        $project: {
          _id: 0,
          level: "$_id",
          wordType: "2",
          name: "집중공략",
          details: 1
        }
      }
    ]);

    result = [...result, ...result4];
  }
  
  return NextResponse.json(result)
}