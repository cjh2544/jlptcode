import { prisma } from "@/app/lib/prisma";
import { createModel } from "@/app/lib/create-model";
import {
  TODAY_INCLUDE,
  syncTodayChoices,
  transformTodayRead,
  writeToday,
} from "@/app/lib/content-shape";

const WordToday = createModel({
  collection: "word_today",
  prisma: prisma.wordToday,
  allowedFields: [
    "id",
    "level",
    "year",
    "study",
    "day",
    "wordNo",
    "word",
    "read",
    "means",
    "wordLocaleEn",
    "wordLocaleCn",
    "wordLocaleMy",
    "sentence",
    "sentence_read",
    "sentence_translate",
    "sentenceLocaleEn",
    "sentenceLocaleCn",
    "sentenceLocaleMy",
    "keyword",
    "questionText",
    "questionAnswer",
    "speaker",
    "sortNo",
  ],
  include: TODAY_INCLUDE,
  transformRead: (doc) => transformTodayRead(doc, true),
  transformWrite: (data) => writeToday(data, true),
  syncRelated: (id, data) => syncTodayChoices(prisma.wordTodayQuestionChoice, id, data.question),
});

export default WordToday;
