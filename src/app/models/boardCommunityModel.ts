import { prisma } from "@/app/lib/prisma";
import { createModel } from "@/app/lib/create-model";

const BoardCommunity = createModel({
  collection: "board_community",
  prisma: prisma.boardCommunity,
  allowedFields: ["id", "name", "email", "title", "contents", "noticeYn"],
  defaults: {
    noticeYn: "N",
  },
});

export default BoardCommunity;
