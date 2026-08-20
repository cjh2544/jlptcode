import { prisma } from "@/app/lib/prisma";
import { createModel } from "@/app/lib/create-model";
import { toPrismaWhere } from "@/app/lib/prisma-model";
import { serializeDocs } from "@/app/utils/serialize";

const Code = createModel({
  collection: "code",
  prisma: prisma.code,
  allowedFields: ["id", "code", "name", "sort"],
  lookups: {
    code_detail: async (filter) => {
      const where = toPrismaWhere(filter);
      const codes: string[] = where.code?.in || (where.code ? [where.code] : []);
      const rows = codes.length
        ? await prisma.codeDetail.findMany({
            where: { code: { in: codes } },
            include: { levels: { orderBy: { sort: "asc" } } },
            orderBy: { sort: "asc" },
          })
        : [];
      return serializeDocs(
        rows.map((row) => ({
          ...row,
          levels: (row.levels || []).map((level) => level.value),
        }))
      );
    },
  },
});

export default Code;
