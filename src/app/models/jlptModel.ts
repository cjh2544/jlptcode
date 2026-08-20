import { prisma } from "@/app/lib/prisma";
import { createModel } from "@/app/lib/create-model";
import {
  EXAM_INCLUDE,
  syncChoices,
  transformExamRead,
  writeExam,
} from "@/app/lib/content-shape";

const JLPT_SHAPE = { sentenceKeys: ["translation"] as const };

const Jlpt = createModel({
  collection: "jlpt",
  prisma: prisma.jlpt,
  allowedFields: [
    "id",
    "year",
    "month",
    "level",
    "sortNo",
    "classification",
    "questionNo",
    "questionContent",
    "questionAudioLink",
    "questionAudioName",
    "questionImageLink",
    "questionImageName",
    "sentenceTranslation",
    "questionType",
    "answer",
  ],
  include: EXAM_INCLUDE,
  transformRead: (doc) => transformExamRead(doc, JLPT_SHAPE),
  transformWrite: (data) => writeExam(data, JLPT_SHAPE),
  syncRelated: (id, data) => syncChoices(prisma.jlptChoice, id, data.choices),
});

export default Jlpt;
