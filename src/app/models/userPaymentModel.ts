import { prisma } from "@/app/lib/prisma";
import { createModel } from "@/app/lib/create-model";
import { toPrismaWhere } from "@/app/lib/prisma-model";
import { newId } from "@/app/lib/new-id";
import { serializeDoc } from "@/app/utils/serialize";

function toPayment(item: Record<string, any>) {
  return {
    _id: item.id,
    id: item.id,
    paymentType: item.paymentType,
    startDate: item.startDate,
    endDate: item.endDate,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

function transformRead(doc: Record<string, any>) {
  const payments = Array.isArray(doc.payments) ? doc.payments.map(toPayment) : [];
  return { ...doc, payments };
}

const UserPayment = createModel({
  collection: "user_payment",
  prisma: prisma.userPayment,
  allowedFields: ["id", "email"],
  include: { payments: { orderBy: { createdAt: "asc" } } },
  transformRead,
  createRelated: async (id, data) => {
    const payments = Array.isArray(data.payments) ? data.payments : [];
    if (!payments.length) return;
    await prisma.userPaymentItem.createMany({
      data: payments.map((item: Record<string, any>) => ({
        id: item._id ? String(item._id) : newId(),
        userPaymentId: id,
        paymentType: item.paymentType,
        startDate: new Date(item.startDate),
        endDate: new Date(item.endDate),
      })),
    });
  },
  pushRelated: async (parentId, field, value) => {
    if (field !== "payments") return;
    await prisma.userPaymentItem.create({
      data: {
        id: value._id ? String(value._id) : newId(),
        userPaymentId: parentId,
        paymentType: value.paymentType,
        startDate: new Date(value.startDate),
        endDate: new Date(value.endDate),
      },
    });
  },
  lookups: {
    user_payment: async (filter) => {
      const rows = await prisma.userPayment.findMany({
        where: toPrismaWhere(filter),
        include: { payments: { orderBy: { createdAt: "asc" } } },
      });
      return rows.map((row) => transformRead(serializeDoc(row)!));
    },
  },
});

export default UserPayment;
