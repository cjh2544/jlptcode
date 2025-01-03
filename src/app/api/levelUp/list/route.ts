import LevelUp from "@/app/models/levelUpModel";
import connectDB from "@/app/utils/database";
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  await connectDB();
  
  const levelUpConditions = await request.json();
  const {level, classification} = levelUpConditions.params || {}
  
  let levelUpList: any[] = [];
  let classNm = 'kangi';  // 과목

  // 조회 문제 수
  let questionSize:any = {
    vocabulary: {
      N1: {
        A: 3,
        B: 3,
        C: 2,
        D: 2,
      },
      N2: {
        A: 3,
        B: 3,
        C: 2,
        D: 2,
      },
      N3: {
        A: 3,
        B: 3,
        C: 2,
        D: 2,
      },
      N4: {
        A: 3,
        B: 3,
        C: 2,
        D: 2,
      },
      N5: {
        A: 3,
        B: 3,
        C: 2,
      }
    },
    grammar: {
      N1: {
        A: 7,
        B: 3,
      },
      N2: {
        A: 7,
        B: 3,
      },
      N3: {
        A: 7,
        B: 3,
      },
      N4: {
        A: 7,
        B: 3,
      },
      N5: {
        A: 7,
        B: 3,
      }
    },
    listening: {
      N1: 5,
      N2: 5,
      N3: 5,
      N4: 5,
      N5: 5,
    }
  }

  let resultData: any[] = [];
  let questionSizeInfo: any = {};

  // 문자/어휘
  if('vocabulary' === classification) {
    questionSizeInfo = questionSize[classification][level];

    for(const key in questionSizeInfo) {
      // 1. 문자/어휘 GROUP 문제 조회
      const groupInfo = await LevelUp.findOne({level, classification, questionType: 'group', questionGroupType: key});
      levelUpList.push(groupInfo);

      // 2. 문자/어휘 문제 랜덤 조회
      resultData = await LevelUp.aggregate([
        { $match: {level, classification, questionType: 'normal', questionGroupType: key} },
        { $sample: { size : questionSizeInfo[key] } }
      ]);

      levelUpList = [...levelUpList, ...resultData];
    }
  } else if('grammar' === classification) {
    questionSizeInfo = questionSize[classification][level];

    for(const key in questionSizeInfo) {
      // 1. 문법 GROUP 문제 조회
      const groupInfo = await LevelUp.findOne({level, classification, questionType: 'group', questionGroupType: key});
      levelUpList.push(groupInfo);

      // 2. 문법 문제 랜덤 조회
      resultData = await LevelUp.aggregate([
        { $match: {level, classification, questionType: 'normal', questionGroupType: key} },
        { $sample: { size : questionSizeInfo[key] } }
      ]);

      levelUpList = [...levelUpList, ...resultData];
    }
  } else if('listening' === classification) {
    questionSize = questionSize[classification][level];

    // 1. GROUP 문제 조회
    const groupInfo = await LevelUp.findOne({level, classification, questionType: 'group'});
    levelUpList.push(groupInfo);

    // 2. 문제 랜덤 조회
    resultData = await LevelUp.aggregate([ { $match: {level, classification, questionType: 'normal'} } , { $sample: { size : questionSize } } ]);
    levelUpList = [...levelUpList, ...resultData];
  }

  let questionNo = 0;

  levelUpList.forEach((item, idx) => {
    item['sortNo'] = idx;

    if((item?.questionType || '') === 'normal') {
      questionNo++;
      item.questionNo = questionNo;
    }
  })

  return NextResponse.json(levelUpList)
}