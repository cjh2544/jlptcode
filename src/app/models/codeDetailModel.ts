import { prisma } from "@/app/lib/prisma";
import { createModel } from "@/app/lib/create-model";
import {
  CODE_DETAIL_INCLUDE,
  flattenValueLocale,
  syncStringList,
  transformCodeDetailRead,
} from "@/app/lib/content-shape";

const CodeDetail = createModel({
  collection: "code_detail",
  prisma: prisma.codeDetail,
  allowedFields: [
    "id",
    "code",
    "key",
    "value",
    "valueLocaleJa",
    "valueLocaleEn",
    "valueLocaleCn",
    "valueLocaleMy",
    "sort",
    "classification",
  ],
  include: CODE_DETAIL_INCLUDE,
  transformRead: transformCodeDetailRead,
  transformWrite: (data) => {
    const next = { ...data };
    if (data.value_locale !== undefined) {
      Object.assign(next, flattenValueLocale(data.value_locale));
      delete next.value_locale;
    }
    return next;
  },
  syncRelated: async (id, data) => {
    await syncStringList(prisma.codeDetailLevel, "codeDetailId", id, data.levels);
  },
});

export default CodeDetail;
