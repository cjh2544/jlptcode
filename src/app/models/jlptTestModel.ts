import { prisma } from "@/app/lib/prisma";
import { createModel } from "@/app/lib/create-model";
import {
  EXAM_INCLUDE,
  syncChoices,
  transformExamRead,
  writeExam,
} from "@/app/lib/content-shape";

const JLPT_TEST_SHAPE = { sentenceKeys: ["translation", "reading", "en", "cn"] as const };

const JlptTest = createModel({
  collection: "jlpt_test",
  prisma: prisma.jlptTest,
  allowedFields: [
    "id",
    "level",
    "test",
    "classification",
    "questionType",
    "questionContent",
    "questionAudioLink",
    "questionAudioName",
    "questionImageLink",
    "questionImageName",
    "sortNo",
    "questionNo",
    "questionNoLabel",
    "sentenceTranslation",
    "sentenceReading",
    "sentenceEn",
    "sentenceCn",
    "answer",
  ],
  include: EXAM_INCLUDE,
  transformRead: (doc) => transformExamRead(doc, JLPT_TEST_SHAPE),
  transformWrite: (data) => writeExam(data, JLPT_TEST_SHAPE),
  syncRelated: (id, data) => syncChoices(prisma.jlptTestChoice, id, data.choices),
});

export default JlptTest;
