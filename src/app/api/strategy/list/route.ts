import LevelUp from "@/app/models/levelUpModel";
import connectDB from "@/app/utils/database";
import { isEmpty, result } from "lodash";
import { NextRequest, NextResponse } from "next/server"

// 조회 문제 수
const questionSize:any = {
  vocabulary: {
    N1: {
      "A-1": 6,
      "A-2": 0,
      "A-3": 0,
      "A-4": 7,
      "A-5": 6,
      "A-6": 6,
    },
    N2: {
      "A-1": 5,
      "A-2": 5,
      "A-3": 5,
      "A-4": 7,
      "A-5": 5,
      "A-6": 5,
    },
    N3: {
      "A-1": 8,
      "A-2": 6,
      "A-3": 0,
      "A-4": 11,
      "A-5": 5,
      "A-6": 5,
    },
    N4: {
      "A-1": 9,
      "A-2": 6,
      "A-3": 0,
      "A-4": 10,
      "A-5": 5,
      "A-6": 5,
    },
    N5: {
      "A-1": 12,
      "A-2": 8,
      "A-3": 0,
      "A-4": 10,
      "A-5": 5,
      "A-6": 0,
    }
  },
  grammar: {
    N1: {
      "A-7": 10,
      "A-8": 5,
      "A-9": 1,
    },
    N2: {
      "A-7": 12,
      "A-8": 5,
      "A-9": 1,
    },
    N3: {
      "A-7": 13,
      "A-8": 5,
      "A-9": 1,
    },
    N4: {
      "A-7": 15,
      "A-8": 5,
      "A-9": 1,
    },
    N5: {
      "A-7": 16,
      "A-8": 5,
      "A-9": 1,
    }
  },
  reading: {
    N1: {
      "A-10": 1,
      "A-11": 1,
      "A-12": 1,
      "A-13": 1,
      "A-14": 1,
      "A-15": 1,
    },
    N2: {
      "A-10": 1,
      "A-11": 1,
      "A-12": 0,
      "A-13": 1,
      "A-14": 1,
      "A-15": 1,
    },
    N3: {
      "A-10": 1,
      "A-11": 1,
      "A-12": 1,
      "A-13": 0,
      "A-14": 0,
      "A-15": 1,
    },
    N4: {
      "A-10": 1,
      "A-11": 1,
      "A-12": 0,
      "A-13": 0,
      "A-14": 0,
      "A-15": 1,
    },
    N5: {
      "A-10": 1,
      "A-11": 1,
      "A-12": 0,
      "A-13": 0,
      "A-14": 0,
      "A-15": 1,
    }
  },
  listening: {
    N1: {
      "B-1": 6,
      "B-2": 7,
      "B-3": 6,
      "B-4": 0,
      "B-5": 14,
      "B-6": 1,
    },
    N2: {
      "B-1": 5,
      "B-2": 6,
      "B-3": 5,
      "B-4": 0,
      "B-5": 12,
      "B-6": 1,
    },
    N3: {
      "B-1": 6,
      "B-2": 6,
      "B-3": 3,
      "B-4": 4,
      "B-5": 9,
      "B-6": 0,
    },
    N4: {
      "B-1": 8,
      "B-2": 7,
      "B-3": 0,
      "B-4": 5,
      "B-5": 8,
      "B-6": 0,
    },
    N5: {
      "B-1": 7,
      "B-2": 6,
      "B-3": 0,
      "B-4": 5,
      "B-5": 6,
      "B-6": 0,
    }
  },
}

const getLevelupData = async (level: string, year: string, classification: string, questionGroupType: string) => {
  let levelUpList: any[] = [];
  let resultData: any[] = [];
  let questionSizeInfo: any = {};

  // 문자/어휘
  if('vocabulary' === classification) {
    questionSizeInfo = questionSize[classification][level];
    
    for(const key in questionSizeInfo) {
      if(questionSizeInfo[key] === 0 || (questionGroupType && questionGroupType !== key)) continue;

      // 1. 문자/어휘 GROUP 문제 조회
      const groupInfo = await LevelUp.findOne({level, year: { $nin: ['random'] }, classification, questionType: 'group', questionGroupType: key});
      levelUpList.push(groupInfo);

      // 2. 문자/어휘 문제 랜덤 조회
      resultData = await LevelUp.aggregate([
        { $match: {level, year: { $nin: ['random'] }, classification, questionType: 'normal', questionGroupType: key} },
        { $sample: { size : questionSizeInfo[key] } }
      ]);

      levelUpList = [...levelUpList, ...resultData];
    }
  } else if('grammar' === classification) {
    questionSizeInfo = questionSize[classification][level];

    for(const key in questionSizeInfo) {
      if(questionSizeInfo[key] === 0 || (questionGroupType && questionGroupType !== key)) continue;

      // 1. 그룹 문제 랜덤 조회
      if(key === 'A-9') {
        // 문장문법 일 경우
        resultData = await LevelUp.aggregate([
          { $match: { level, year: { $nin: ['random'] }, classification, questionType: 'group', questionGroupType: key} },
          { $sample: { size : questionSizeInfo[key] } 
        }]);

        let qDataList:any = [];

        for (const item of resultData) {
          qDataList = [
            ...qDataList,
            ...await LevelUp.find({
              level: item.level,
              year: item.year,
              classification: item.classification,
              questionGroupType: item.questionGroupType,
              questionGroupNo: item.questionGroupNo,
            })
          ];
        }

        levelUpList = [...levelUpList, ...qDataList];
      } else {
        // 1. 문법 GROUP 문제 조회
        const groupInfo = await LevelUp.findOne({level, year: { $nin: ['random'] }, classification, questionType: 'group', questionGroupType: key});
        levelUpList.push(groupInfo);

        // 2. 문법 문제 랜덤 조회
        resultData = await LevelUp.aggregate([
          { $match: {level, year: { $nin: ['random'] }, classification, questionType: 'normal', questionGroupType: key} },
          { $sample: { size : questionSizeInfo[key] } }
        ]);

        levelUpList = [...levelUpList, ...resultData];
      }
    }
  } else if('listening' === classification) {
    questionSizeInfo = questionSize[classification][level];

    for(const key in questionSizeInfo) {
      if(questionSizeInfo[key] === 0 || (questionGroupType && questionGroupType !== key)) continue;

      // 1. 그룹 문제 랜덤 조회
      if(key === 'B-6') {
        // 통합이해 일 경우
        resultData = await LevelUp.aggregate([
          { $match: { level, year: { $nin: ['random'] }, classification, questionType: 'group', questionGroupType: key} },
          { $sample: { size : questionSizeInfo[key] } 
        }]);

        let qDataList:any = [];

        for (const item of resultData) {
          qDataList = [
            ...qDataList,
            ...await LevelUp.find({
              level: item.level,
              year: item.year,
              classification: item.classification,
              questionGroupType: item.questionGroupType,
              questionGroupNo: item.questionGroupNo,
            })
          ];
        }

        levelUpList = [...levelUpList, ...qDataList];
      } else {
        // 1. GROUP 문제 조회
        const groupInfo = await LevelUp.findOne({level, year: { $nin: ['random'] }, classification, questionType: 'group', questionGroupType: key});
        levelUpList.push(groupInfo);

        resultData = await LevelUp.aggregate([
          { $match: {level, year: { $nin: ['random'] }, classification, questionType: 'normal', questionGroupType: key} },
          { $sample: { size : questionSizeInfo[key] } }
        ]);

        levelUpList = [...levelUpList, ...resultData];
      }
      
    }
  } else if('reading' === classification) {
    questionSizeInfo = questionSize[classification][level];

    for(const key in questionSizeInfo) {
      if(questionSizeInfo[key] === 0 || (questionGroupType && questionGroupType !== key)) continue;

        // 1. GROUP 문제 조회
        resultData = await LevelUp.aggregate([
          { $match: { level, year: { $nin: ['random'] }, classification, questionType: 'group', questionGroupType: key} },
          { $sample: { size : questionSizeInfo[key] } 
        }]);

        let qDataList:any = [];

        for (const item of resultData) {
          qDataList = [
            ...qDataList,
            ...await LevelUp.find({
              level: item.level,
              year: item.year,
              classification: item.classification,
              questionGroupType: item.questionGroupType,
              questionGroupNo: item.questionGroupNo,
            })
          ];
        }
        
        levelUpList = [...levelUpList, ...qDataList];
    }
  }

  let questionNo = 0;

  levelUpList.forEach((item, idx) => {
    item['sortNo'] = idx;

    if((item?.questionType || '') === 'normal') {
      questionNo++;
      item.questionNo = questionNo;
    }
  })

  return levelUpList;
}

const getLevelupDataByYear = async (level: string, year: string, classification: string, questionGroupType: string) => {
  let levelUpList: any[] = [];
  let resultData: any[] = [];
  let questionSizeInfo: any = {};

  let conditions: any = {};

  if(level) {
    conditions = { ...conditions, level };
  }

  if(year) {
    conditions = { ...conditions, year };
  }

  if(classification) {
    conditions = { ...conditions, classification };
  }

  if(questionGroupType) {
    conditions = { ...conditions, questionGroupType };
  }

  // 문자/어휘
  if('vocabulary' === classification) {
    resultData = await LevelUp.find(conditions).sort({sortNo: 1});
    levelUpList = [...levelUpList, ...resultData];
  } else if('grammar' === classification) {
    resultData = await LevelUp.find(conditions).sort({sortNo: 1});
    levelUpList = [...levelUpList, ...resultData];
  } else if('listening' === classification) {
    resultData = await LevelUp.find(conditions).sort({sortNo: 1});
    levelUpList = [...levelUpList, ...resultData];
  } else if('reading' === classification) {
    resultData = await LevelUp.find(conditions).sort({sortNo: 1});
    levelUpList = [...levelUpList, ...resultData];
  }


  // if(year === 'random') {
  //   let questionNo = 0;

  //   levelUpList.forEach((item, idx) => {
  //     item['sortNo'] = idx;

  //     if((item?.questionType || '') === 'normal') {
  //       questionNo++;
  //       item.questionNo = questionNo;
  //     }
  //   })
  // }

  return levelUpList;
}

export async function POST(request: NextRequest) {
  await connectDB();
  
  const levelUpConditions = await request.json();
  const {level, year, classification, questionGroupType} = levelUpConditions.params || {}
  
  let levelUpList: any[] = [];

  const classificationList = classification.split(',');

  // 년도를 선택한 경우
  if(year) {
    for(let idx in classificationList) {
      levelUpList = [...levelUpList, ...await getLevelupDataByYear(level, year, classificationList[idx], questionGroupType)];
    }
  } else {
    for(let idx in classificationList) {
      levelUpList = [...levelUpList, ...await getLevelupData(level, year, classificationList[idx], questionGroupType)];
    }

    let questionNo = 0;
  
    levelUpList.forEach((item, idx) => {
      item['sortNo'] = idx;
  
      if((item?.questionType || '') === 'normal') {
        questionNo++;
        item.questionNo = questionNo;
      }
    });
  }


  return NextResponse.json(levelUpList)
}
