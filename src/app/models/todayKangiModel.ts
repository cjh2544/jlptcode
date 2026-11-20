import { prisma } from "@/app/lib/prisma";
import { createModel } from "@/app/lib/create-model";

const TodayKangi = createModel({
  collection: "today_kangi",
  prisma: prisma.todayKangi,
  allowedFields: ["id", "level", "sortNo", "word", "image"],
});

export default TodayKangi;
