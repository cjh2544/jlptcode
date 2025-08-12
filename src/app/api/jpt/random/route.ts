import Jpt from "@/app/models/jptModel";
import connectDB from "@/app/utils/database";
import { result } from "lodash";
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  await connectDB();
  
  const levelUpConditions = await request.json();
  const {level, part} = levelUpConditions.params || {}
  
  let levelUpList: any[] = [];

  // 조회 문제 수
  let questionSize:any = {
    ['고급(800)']: {
      "part1": 1,
      "part2": 5,
      "part3": 1,
      "part4": 1,
      "part5": 5,
      "part6": 5,
      "part7": 1,
      "part8": 1,
    },
    ['상급(650)']: {
      "part1": 1,
      "part2": 5,
      "part3": 1,
      "part4": 1,
      "part5": 5,
      "part6": 5,
      "part7": 1,
      "part8": 1,
    },
    ['중급(500)']: {
      "part1": 1,
      "part2": 5,
      "part3": 1,
      "part4": 1,
      "part5": 5,
      "part6": 5,
      "part7": 1,
      "part8": 1,
    },
    ['초급(400)']: {
      "part1": 1,
      "part2": 5,
      "part3": 1,
      "part4": 1,
      "part5": 5,
      "part6": 5,
      "part7": 1,
      "part8": 1,
    },
    ['기초']: {
      "part1": 1,
      "part2": 5,
      "part3": 1,
      "part4": 1,
      "part5": 5,
      "part6": 5,
      "part7": 1,
      "part8": 1,
    }
  }

  let resultData: any[] = [];
  let questionSizeInfo: any = {};

  // 독해
  if('part8' === part) {
    questionSizeInfo = questionSize[level][part];

    // 1. GROUP 문제 조회
    const groupInfo = await Jpt.findOne({part, questionType: 'group'});
    
    levelUpList.push(groupInfo);

    // 2. 문제 랜덤 조회
    resultData = await Jpt.aggregate([
      { $match: {level, part, questionType: 'content'} },
      { $sample: { size : questionSizeInfo } 
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
          sortNo: Number(item.sortNo) + 1,
        })
      )
      
      levelUpList = [...levelUpList, ...qDataList];
    }
    
  } else {
    questionSizeInfo = questionSize[level][part];

    // 1. GROUP 문제 조회
    const groupInfo = await Jpt.findOne({part, questionType: 'group'});
    levelUpList.push(groupInfo);

    // 2. 문제 랜덤 조회
    resultData = await Jpt.aggregate([
      { $match: {level, part, questionType: 'normal'} },
      { $sample: { size : questionSizeInfo } }
    ]);

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
