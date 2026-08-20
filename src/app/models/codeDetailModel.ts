import { prisma } from "@/app/lib/prisma";
import { createModel } from "@/app/lib/create-model";
import { CODE_DETAIL_INCLUDE, syncStringList, transformCodeDetailRead } from "@/app/lib/content-shape";

const CodeDetail = createModel({
  collection: "code_detail",
  prisma: prisma.codeDetail,
  allowedFields: ["id", "code", "key", "value", "sort", "classification"],
  include: CODE_DETAIL_INCLUDE,
  transformRead: transformCodeDetailRead,
  syncRelated: async (id, data) => {
    await syncStringList(prisma.codeDetailLevel, "codeDetailId", id, data.levels);
  },
});

export default CodeDetail;
