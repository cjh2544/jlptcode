import { prisma } from "@/app/lib/prisma";
import { createModel } from "@/app/lib/create-model";

const UserSavedQuestion = createModel({
  collection: "user_saved_question",
  prisma: prisma.userSavedQuestion,
  allowedFields: [
    "id",
    "userId",
    "source",
    "sourceId",
    "subject",
    "content",
    "level",
    "classification",
    "year",
    "study",
  ],
});

export default UserSavedQuestion;
