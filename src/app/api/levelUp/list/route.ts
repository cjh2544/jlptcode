import LevelUp from "@/app/models/levelUpModel";
import connectDB from "@/app/utils/database";
import { NextRequest, NextResponse } from "next/server"

const YEAR_FILTER = { $nin: ["random"] };

const questionSize: any = {
  vocabulary: {
    N1: { "A-1": 3, "A-4": 3, "A-5": 2, "A-6": 2 },
    N2: { "A-1": 2, "A-2": 2, "A-3": 1, "A-4": 3, "A-5": 1, "A-6": 1 },
    N3: { "A-1": 3, "A-2": 2, "A-4": 3, "A-5": 1, "A-6": 1 },
    N4: { "A-1": 3, "A-2": 2, "A-4": 3, "A-5": 1, "A-6": 1 },
    N5: { "A-1": 3, "A-2": 3, "A-4": 3, "A-5": 1 },
  },
  grammar: {
    N1: { "A-7": 7, "A-8": 3 },
    N2: { "A-7": 7, "A-8": 3 },
    N3: { "A-7": 7, "A-8": 3 },
    N4: { "A-7": 7, "A-8": 3 },
    N5: { "A-7": 7, "A-8": 3 },
  },
  listening: {
    N1: { "B-1": 1, "B-2": 1, "B-5": 3 },
    N2: { "B-1": 1, "B-2": 1, "B-5": 3 },
    N3: { "B-1": 1, "B-2": 1, "B-5": 3 },
    N4: { "B-1": 1, "B-2": 1, "B-5": 3 },
    N5: { "B-1": 1, "B-2": 1, "B-5": 3 },
  },
  reading: {
    N1: { "A-10": 1, "A-11": 1 },
    N2: { "A-10": 1, "A-11": 1 },
    N3: { "A-10": 1, "A-11": 1 },
    N4: { "A-10": 1, "A-11": 1 },
    N5: { "A-10": 1, "A-11": 1 },
  },
};

function groupMatch(level: string, classification: string, key: string) {
  return {
    level,
    year: YEAR_FILTER,
    classification,
    questionType: "group",
    questionGroupType: key,
  };
}

async function loadSampleGroups(
  level: string,
  classification: string,
  questionType: string,
  sizeInfo: Record<string, number> = {},
) {
  const chunks = await Promise.all(
    Object.entries(sizeInfo).map(async ([key, size]) => {
      const [groupInfo, sampled] = await Promise.all([
        LevelUp.findOne(groupMatch(level, classification, key)),
        LevelUp.aggregate([
          {
            $match: {
              level,
              year: YEAR_FILTER,
              classification,
              questionType,
              questionGroupType: key,
            },
          },
          { $sample: { size } },
        ]),
      ]);
      return [groupInfo, ...sampled].filter(Boolean);
    }),
  );
  return chunks.flat();
}

async function loadReadingGroups(level: string, classification: string, sizeInfo: Record<string, number> = {}) {
  const chunks = await Promise.all(
    Object.entries(sizeInfo).map(async ([key, size]) => {
      const [groupInfo, contents] = await Promise.all([
        LevelUp.findOne(groupMatch(level, classification, key)),
        LevelUp.aggregate([
          {
            $match: {
              level,
              year: YEAR_FILTER,
              classification,
              questionType: "content",
              questionGroupType: key,
            },
          },
          { $sample: { size } },
        ]),
      ]);
      const normals = await Promise.all(
        contents.map((item: any) =>
          LevelUp.findOne({
            level: item.level,
            year: item.year,
            classification: item.classification,
            questionGroupType: item.questionGroupType,
            questionType: "normal",
            questionContentNo: item.questionContentNo,
          }),
        ),
      );
      return [groupInfo, ...contents.flatMap((item: any, idx: number) => [item, normals[idx]])].filter(Boolean);
    }),
  );
  return chunks.flat();
}

export async function POST(request: NextRequest) {
  await connectDB();

  const levelUpConditions = await request.json();
  const { level, classification } = levelUpConditions.params || {};
  const sizeInfo = questionSize[classification]?.[level] || {};

  let levelUpList: any[] = [];
  if (classification === "reading") {
    levelUpList = await loadReadingGroups(level, classification, sizeInfo);
  } else if (classification) {
    levelUpList = await loadSampleGroups(level, classification, "normal", sizeInfo);
  }

  let questionNo = 0;
  levelUpList.forEach((item, idx) => {
    item.sortNo = idx;
    if ((item?.questionType || "") === "normal") {
      questionNo++;
      item.questionNo = questionNo;
    }
  });

  return NextResponse.json(levelUpList);
}
