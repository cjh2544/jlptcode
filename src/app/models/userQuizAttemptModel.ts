import { prisma } from "@/app/lib/prisma";
import { createModel } from "@/app/lib/create-model";

const UserQuizAttempt = createModel({
  collection: "user_quiz_attempt",
  prisma: prisma.userQuizAttempt,
  allowedFields: ["id", "userId", "subject", "level", "total", "correct", "wrong"],
});

export default UserQuizAttempt;
