import Jpt from "@/app/models/jptModel";
import connectDB from "@/app/utils/database";
import { result } from "lodash";
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  await connectDB();
  
  const jptConditions = await request.json();
  const {level, classification} = jptConditions.params || {}
  
  let jptList: any[] = [];
  let classNm = 'kangi';  // 과목

  // 조회 문제 수
  let questionSize:any = {
    vocabulary: {
      N1: {
        "A-1": 3,
        "A-4": 3,
        "A-5": 2,
        "A-6": 2,
      },
      N2: {
        "A-1": 2,
        "A-2": 2,
        "A-3": 1,
        "A-4": 3,
        "A-5": 1,
        "A-6": 1,
      },
      N3: {
        "A-1": 3,
        "A-2": 2,
        "A-4": 3,
        "A-5": 1,
        "A-6": 1,
      },
      N4: {
        "A-1": 3,
        "A-2": 2,
        "A-4": 3,
        "A-5": 1,
        "A-6": 1,
      },
      N5: {
        "A-1": 3,
        "A-2": 3,
        "A-4": 3,
        "A-5": 1,
      }
    },
    grammar: {
      N1: {
        "A-7": 7,
        "A-8": 3,
      },
      N2: {
        "A-7": 7,
        "A-8": 3,
      },
      N3: {
        "A-7": 7,
        "A-8": 3,
      },
      N4: {
        "A-7": 7,
        "A-8": 3,
      },
      N5: {
        "A-7": 7,
        "A-8": 3,
      }
    },
    listening: {
      N1: {
        "B-1": 1,
        "B-2": 1,
        "B-5": 3,
      },
      N2: {
        "B-1": 1,
        "B-2": 1,
        "B-5": 3,
      },
      N3: {
        "B-1": 1,
        "B-2": 1,
        "B-5": 3,
      },
      N4: {
        "B-1": 1,
        "B-2": 1,
        "B-5": 3,
      },
      N5: {
        "B-1": 1,
        "B-2": 1,
        "B-5": 3,
      }
    },
    reading: {
      N1: {
        "A-10": 1,
        "A-11": 1,
      },
      N2: {
        "A-10": 1,
        "A-11": 1,
      },
      N3: {
        "A-10": 1,
        "A-11": 1,
      },
      N4: {
        "A-10": 1,
        "A-11": 1,
      },
      N5: {
        "A-10": 1,
        "A-11": 1,
      }
    }
  }

  let resultData: any[] = [];
  let questionSizeInfo: any = {};

  // 문자/어휘
  if('vocabulary' === classification) {
    questionSizeInfo = questionSize[classification][level];

    for(const key in questionSizeInfo) {
      // 1. 문자/어휘 GROUP 문제 조회
      const groupInfo = await Jpt.findOne({level, year: { $nin: ['random'] }, classification, questionType: 'group', questionGroupType: key});
      jptList.push(groupInfo);

      // 2. 문자/어휘 문제 랜덤 조회
      resultData = await Jpt.aggregate([
        { $match: {level, year: { $nin: ['random'] }, classification, questionType: 'normal', questionGroupType: key} },
        { $sample: { size : questionSizeInfo[key] } }
      ]);

      jptList = [...jptList, ...resultData];
    }
  } else if('grammar' === classification) {
    questionSizeInfo = questionSize[classification][level];

    for(const key in questionSizeInfo) {
      // 1. 문법 GROUP 문제 조회
      const groupInfo = await Jpt.findOne({level, year: { $nin: ['random'] }, classification, questionType: 'group', questionGroupType: key});
      jptList.push(groupInfo);

      // 2. 문법 문제 랜덤 조회
      resultData = await Jpt.aggregate([
        { $match: {level, year: { $nin: ['random'] }, classification, questionType: 'normal', questionGroupType: key} },
        { $sample: { size : questionSizeInfo[key] } }
      ]);

      jptList = [...jptList, ...resultData];
    }
  } else if('listening' === classification) {
    questionSizeInfo = questionSize[classification][level];

    for(const key in questionSizeInfo) {
      // 1. GROUP 문제 조회
      const groupInfo = await Jpt.findOne({level, year: { $nin: ['random'] }, classification, questionType: 'group', questionGroupType: key});
      jptList.push(groupInfo);

      // 2. 문제 랜덤 조회
      resultData = await Jpt.aggregate([
        { $match: {level, year: { $nin: ['random'] }, classification, questionType: 'normal', questionGroupType: key} },
        { $sample: { size : questionSizeInfo[key] } 
      }]);
      jptList = [...jptList, ...resultData];
    }
  } else if('reading' === classification) {
    questionSizeInfo = questionSize[classification][level];

    for(const key in questionSizeInfo) {
      // if(key === 'A-10') {
        // 1. GROUP 문제 조회
        const groupInfo = await Jpt.findOne({level, year: { $nin: ['random'] }, classification, questionType: 'group', questionGroupType: key});
        
        jptList.push(groupInfo);

        // 2. 문제 랜덤 조회
        resultData = await Jpt.aggregate([
          { $match: {level, year: { $nin: ['random'] }, classification, questionType: 'content', questionGroupType: key} },
          { $sample: { size : questionSizeInfo[key] } 
        }]);

        let qDataList = [];

        for (const item of resultData) {
          qDataList.push(item);

          qDataList.push(
            await Jpt.findOne({
              level: item.level,
              year: item.year,
              classification: item.classification,
              questionGroupType: item.questionGroupType,
              questionType: 'normal',
              questionContentNo: item.questionContentNo,
            })
          )
        }
        
        jptList = [...jptList, ...qDataList];
    }
  }

  let questionNo = 0;

  jptList.forEach((item, idx) => {
    item['sortNo'] = idx;

    if((item?.questionType || '') === 'normal') {
      questionNo++;
      item.questionNo = questionNo;
    }
  })

  return NextResponse.json(jptList)
}
