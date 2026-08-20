import { prisma } from "@/app/lib/prisma";
import { createModel } from "@/app/lib/create-model";

const UserSavedWord = createModel({
  collection: "user_saved_word",
  prisma: prisma.userSavedWord,
  allowedFields: ["id", "userId", "source", "sourceId", "word", "read", "means", "level"],
});

export default UserSavedWord;
