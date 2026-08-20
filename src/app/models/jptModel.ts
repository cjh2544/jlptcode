import { prisma } from "@/app/lib/prisma";
import { createModel } from "@/app/lib/create-model";
import {
  EXAM_INCLUDE,
  syncChoices,
  transformExamRead,
  writeExam,
} from "@/app/lib/content-shape";

const JPT_SHAPE = { sentenceKeys: ["translation", "reading"] as const };

const Jpt = createModel({
  collection: "jpt",
  prisma: prisma.jpt,
  allowedFields: [
    "id",
    "level",
    "part",
    "year",
    "classification",
    "questionGroupType",
    "questionContent",
    "questionAudioLink",
    "questionAudioName",
    "questionImageLink",
    "questionImageName",
    "questionType",
    "questionGroupNo",
    "questionContentNo",
    "sortNo",
    "questionNo",
    "sentenceTranslation",
    "sentenceReading",
    "answer",
    "speaker",
  ],
  include: EXAM_INCLUDE,
  transformRead: (doc) => transformExamRead(doc, JPT_SHAPE),
  transformWrite: (data) => writeExam(data, JPT_SHAPE),
  syncRelated: (id, data) => syncChoices(prisma.jptChoice, id, data.choices),
});

export default Jpt;
