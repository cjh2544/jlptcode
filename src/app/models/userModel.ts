import { prisma } from "@/app/lib/prisma";
import { createModel } from "@/app/lib/create-model";
import { toPrismaWhere } from "@/app/lib/prisma-model";
import { USER_INCLUDE, syncStringList, transformUserRead } from "@/app/lib/content-shape";
import { serializeDoc } from "@/app/utils/serialize";

const User = createModel({
  collection: "user",
  prisma: prisma.user,
  allowedFields: ["id", "name", "email", "password", "image", "provider"],
  defaults: {
    provider: "credentials",
  },
  mongoDefaults: {
    role: ["user"],
  },
  include: USER_INCLUDE,
  transformRead: transformUserRead,
  syncRelated: async (id, data) => {
    const roles = Array.isArray(data.role) && data.role.length ? data.role : ["user"];
    await syncStringList(prisma.userRole, "userId", id, roles);
  },
  lookups: {
    user_payment: async (filter) => {
      const rows = await prisma.userPayment.findMany({
        where: toPrismaWhere(filter),
        include: { payments: { orderBy: { createdAt: "asc" } } },
      });
      return rows.map((row) => {
        const doc = serializeDoc(row)!;
        return {
          ...doc,
          payments: (row.payments || []).map((item) => ({
            _id: item.id,
            id: item.id,
            paymentType: item.paymentType,
            startDate: item.startDate,
            endDate: item.endDate,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
          })),
        };
      });
    },
  },
});

export default User;
