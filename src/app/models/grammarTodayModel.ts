import { prisma } from "@/app/lib/prisma";
import { createModel } from "@/app/lib/create-model";
import {
  TODAY_INCLUDE,
  syncTodayChoices,
  transformTodayRead,
  writeToday,
} from "@/app/lib/content-shape";

const GrammarToday = createModel({
  collection: "grammar_today",
  prisma: prisma.grammarToday,
  allowedFields: [
    "id",
    "level",
    "year",
    "study",
    "sortNo",
    "sentence",
    "sentence_read",
    "sentence_translate",
    "sentenceLocaleEn",
    "sentenceLocaleCn",
    "sentenceLocaleMy",
    "questionText",
    "questionAnswer",
    "speaker",
  ],
  include: TODAY_INCLUDE,
  transformRead: (doc) => transformTodayRead(doc),
  transformWrite: (data) => writeToday(data),
  syncRelated: (id, data) => syncTodayChoices(prisma.grammarTodayQuestionChoice, id, data.question),
});

export default GrammarToday;
