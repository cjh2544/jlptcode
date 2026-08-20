import { prisma } from "@/app/lib/prisma";
import { createModel } from "@/app/lib/create-model";
import { WORD_INCLUDE, syncStringList, transformWordRead } from "@/app/lib/content-shape";

const JptWord = createModel({
  collection: "jpt_word",
  prisma: prisma.jptWord,
  allowedFields: ["id", "type", "level", "word", "read"],
  relationContainsFields: { parts: { field: "value" } },
  include: WORD_INCLUDE,
  transformRead: transformWordRead,
  syncRelated: async (id, data) => {
    await syncStringList(prisma.jptWordMean, "wordId", id, data.means);
    await syncStringList(prisma.jptWordPart, "wordId", id, data.parts);
  },
});

export default JptWord;
