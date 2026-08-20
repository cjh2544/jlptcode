import { prisma } from "@/app/lib/prisma";
import { createModel } from "@/app/lib/create-model";

const UserQuestionResult = createModel({
  collection: "user_question_result",
  prisma: prisma.userQuestionResult,
  allowedFields: ["id", "userId", "source", "sourceId", "subject", "isCorrect", "attemptId"],
});

export default UserQuestionResult;
