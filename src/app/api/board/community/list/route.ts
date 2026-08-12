import connectDB from "@/app/utils/database";
import { NextRequest, NextResponse } from "next/server";
import BoardCommunity from "@/app/models/boardCommunityModel";
import BoardReply from "@/app/models/boardReplyModel";

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function POST(request: NextRequest) {
  await connectDB();

  const { pageInfo, searchInfo = {} } = await request.json();
  const keyword = typeof searchInfo?.keyword === "string" ? searchInfo.keyword.trim() : "";

  const pageSize = Math.max(Number(pageInfo?.pageSize) || 10, 1);
  let currentPage = Math.max(Number(pageInfo?.currentPage) || 1, 1);

  const listConditions: Record<string, unknown> = { noticeYn: "N" };
  if (keyword) {
    const regex = new RegExp(escapeRegex(keyword), "i");
    listConditions.$or = [{ title: regex }, { contents: regex }];
  }

  const boardCount = await BoardCommunity.countDocuments(listConditions);
  const totalPage = Math.max(Math.ceil(boardCount / pageSize), 1);
  if (currentPage > totalPage) currentPage = totalPage;

  const [noticeList, communityList] = await Promise.all([
    BoardCommunity.find({ noticeYn: "Y" })
      .select("name email title contents noticeYn createdAt updatedAt")
      .sort({ createdAt: -1 })
      .lean(),
    BoardCommunity.find(listConditions)
      .select("name email title contents noticeYn createdAt updatedAt")
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize)
      .lean(),
  ]);

  const boards = [...noticeList, ...communityList];
  const boardIds = boards.map((board) => String(board._id));

  const replyList =
    boardIds.length > 0
      ? await BoardReply.find({ board_id: { $in: boardIds } })
          .select("board_id name email contents createdAt updatedAt")
          .lean()
      : [];

  const replyMap = new Map(
    replyList.map((reply) => [String(reply.board_id), reply]),
  );

  const list = boards.map((board) => {
    const replyInfo = replyMap.get(String(board._id));
    return {
      ...board,
      _id: String(board._id),
      hasReply: Boolean(replyInfo),
      replyInfo: replyInfo || null,
    };
  });

  return NextResponse.json({
    list,
    pageInfo: {
      ...pageInfo,
      pageSize,
      total: boardCount,
      totalPage,
      currentPage,
    },
  });
}
