import Jpt from "@/app/models/jptModel";
import connectDB from "@/app/utils/database";
import { NextRequest, NextResponse } from "next/server"

const questionSize: any = {
  "고급(800)": { part1: 1, part2: 5, part3: 1, part4: 1, part5: 5, part6: 5, part7: 5, part8: 1 },
  "상급(650)": { part1: 1, part2: 5, part3: 1, part4: 1, part5: 5, part6: 5, part7: 5, part8: 1 },
  "중급(500)": { part1: 1, part2: 5, part3: 1, part4: 1, part5: 5, part6: 5, part7: 5, part8: 1 },
  "초급(400)": { part1: 1, part2: 5, part3: 1, part4: 1, part5: 5, part6: 5, part7: 5, part8: 1 },
  기초: { part1: 1, part2: 5, part3: 1, part4: 1, part5: 5, part6: 5, part7: 5, part8: 1 },
};

async function loadRandomPart(level: string, part: string, size: number, questionType: string) {
  const [groupInfo, sampled] = await Promise.all([
    Jpt.findOne({ part, questionType: "group" }),
    Jpt.aggregate([
      { $match: { level, part, questionType } },
      { $sample: { size } },
    ]),
  ]);
  if (!groupInfo) return [];

  if (questionType !== "content") {
    return [groupInfo, ...sampled];
  }

  const normals = await Promise.all(
    sampled.map((item: any) =>
      Jpt.findOne({
        level: item.level,
        year: item.year,
        classification: item.classification,
        questionGroupType: item.questionGroupType,
        questionType: "normal",
        sortNo: Number(item.sortNo) + 1,
      }),
    ),
  );
  return [groupInfo, ...sampled.flatMap((item: any, idx: number) => [item, normals[idx]])].filter(Boolean);
}

export async function POST(request: NextRequest) {
  await connectDB();

  const levelUpConditions = await request.json();
  const { level, part } = levelUpConditions.params || {};
  const size = questionSize[level]?.[part];
  if (!level || !part || size == null) {
    return NextResponse.json([]);
  }

  const levelUpList = await loadRandomPart(
    level,
    part,
    size,
    part === "part8" ? "content" : "normal",
  );

  let questionNo = 0;
  levelUpList.forEach((item: any, idx: number) => {
    item.sortNo = idx;
    if ((item?.questionType || "") === "normal") {
      questionNo++;
      item.questionNo = questionNo;
    }
  });

  return NextResponse.json(levelUpList);
}
