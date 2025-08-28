import Jpt from "@/app/models/jptModel";
import connectDB from "@/app/utils/database";
import { result } from "lodash";
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  await connectDB();
  
  const jptConditions = await request.json();
  const {level, classification, part} = jptConditions.params || {}
  
  let jptList: any[] = [];

  // 조회 문제 수
  let questionSize:any = {
    ['고급(800)']: {
      "part1": 1,
      "part2": 30,
      "part3": 10,
      "part4": 1,
      "part5": 20,
      "part6": 1,
      "part7": 30,
      "part8": 3,
    },
    ['상급(650)']: {
      "part1": 1,
      "part2": 30,
      "part3": 10,
      "part4": 1,
      "part5": 20,
      "part6": 1,
      "part7": 30,
      "part8": 3,
    },
    ['중급(500)']: {
      "part1": 1,
      "part2": 30,
      "part3": 10,
      "part4": 1,
      "part5": 20,
      "part6": 1,
      "part7": 30,
      "part8": 3,
    },
    ['초급(400)']: {
      "part1": 1,
      "part2": 30,
      "part3": 10,
      "part4": 1,
      "part5": 20,
      "part6": 1,
      "part7": 30,
      "part8": 3,
    },
    ['기초']: {
      "part1": 1,
      "part2": 30,
      "part3": 10,
      "part4": 1,
      "part5": 20,
      "part6": 1,
      "part7": 30,
      "part8": 3,
    }
  }

  let resultData: any[] = [];
  let questionSizeInfo: any = {};

  // 독해
  if('part8' === part) {
    questionSizeInfo = questionSize[level][part];

    // 1. GROUP 문제 조회
    const groupInfo = await Jpt.findOne({part, questionType: 'group'});
    
    if(groupInfo) {
      jptList.push(groupInfo);

      // 2. 문제 랜덤 조회
      resultData = await Jpt.aggregate([
        { $match: {level, part, questionType: 'content'} },
        { $sample: { size : questionSizeInfo } 
      }]);

      let qDataList = [];

      for (const item of resultData) {
        qDataList.push(item);

        qDataList.push(
          ...await Jpt.find({
            level: item.level,
            part: item.part,
            classification: item.classification,
            questionGroupNo: item.questionGroupNo,
            questionType: 'normal',
          })
        )
    
        jptList = [...jptList, ...qDataList];
      }
    }
    
  } else {
    questionSizeInfo = questionSize[level][part];

    // 1. GROUP 문제 조회
    const groupInfo = await Jpt.findOne({part, questionType: 'group'});

    if(groupInfo) {
      jptList.push(groupInfo);

      // 2. 문제 랜덤 조회
      resultData = await Jpt.aggregate([
        { $match: {level, part, questionType: 'normal'} },
        { $sample: { size : questionSizeInfo } }
      ]);

      jptList = [...jptList, ...resultData];
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
