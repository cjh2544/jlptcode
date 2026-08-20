import { prisma } from "@/app/lib/prisma";
import { createModel } from "@/app/lib/create-model";
import {
  EXAM_INCLUDE,
  syncChoices,
  transformExamRead,
  writeExam,
} from "@/app/lib/content-shape";

const LEVEL_UP_SHAPE = { withOrg: true, sentenceKeys: ["translation", "reading"] as const, locale: true };

const LevelUp = createModel({
  collection: "level_up",
  prisma: prisma.levelUp,
  allowedFields: [
    "id",
    "year",
    "level",
    "sortNo",
    "classification",
    "questionNo",
    "questionGroupNo",
    "questionContentNo",
    "questionContent",
    "questionContentOrg",
    "questionAudioLink",
    "questionAudioName",
    "questionImageLink",
    "questionImageName",
    "questionGroupType",
    "questionType",
    "answer",
    "sentenceTranslation",
    "sentenceReading",
    "speaker",
    "sentenceLocaleEn",
    "sentenceLocaleCn",
    "sentenceLocaleMy",
  ],
  include: EXAM_INCLUDE,
  transformRead: (doc) => transformExamRead(doc, LEVEL_UP_SHAPE),
  transformWrite: (data) => writeExam(data, LEVEL_UP_SHAPE),
  syncRelated: (id, data) => syncChoices(prisma.levelUpChoice, id, data.choices),
});

export default LevelUp;
