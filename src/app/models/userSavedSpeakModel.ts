import { prisma } from "@/app/lib/prisma";
import { createModel } from "@/app/lib/create-model";

const UserSavedSpeak = createModel({
  collection: "user_saved_speak",
  prisma: prisma.userSavedSpeak,
  allowedFields: [
    "id",
    "userId",
    "source",
    "sourceId",
    "keyword",
    "sentence",
    "sentenceRead",
    "sentenceTranslate",
    "speaker",
    "level",
    "study",
  ],
});

export default UserSavedSpeak;
