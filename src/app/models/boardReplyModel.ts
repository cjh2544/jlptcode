import { prisma } from "@/app/lib/prisma";
import { createModel } from "@/app/lib/create-model";

const BoardReply = createModel({
  collection: "board_reply",
  prisma: prisma.boardReply,
  allowedFields: ["id", "board_id", "name", "email", "contents"],
});

export default BoardReply;
