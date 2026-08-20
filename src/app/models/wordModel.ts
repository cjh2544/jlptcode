import { prisma } from "@/app/lib/prisma";
import { createModel } from "@/app/lib/create-model";
import { WORD_INCLUDE, syncStringList, transformWordRead } from "@/app/lib/content-shape";

const Word = createModel({
  collection: "word",
  prisma: prisma.word,
  allowedFields: ["id", "type", "level", "word", "read"],
  relationContainsFields: { parts: { field: "value" } },
  include: WORD_INCLUDE,
  transformRead: transformWordRead,
  syncRelated: async (id, data) => {
    await syncStringList(prisma.wordMean, "wordId", id, data.means);
    await syncStringList(prisma.wordPart, "wordId", id, data.parts);
  },
});

export default Word;
