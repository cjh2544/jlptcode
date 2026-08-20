import { prisma } from "@/app/lib/prisma";
import { createModel } from "@/app/lib/create-model";

const ReadingToday = createModel({
  collection: "reading_today",
  prisma: prisma.readingToday,
  allowedFields: ["id", "level", "source", "sentence", "sentence_read", "sentence_translate"],
});

export default ReadingToday;
