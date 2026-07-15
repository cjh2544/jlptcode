import BoardReply from "@/app/models/boardReplyModel";
import User from "@/app/models/userModel";
import connectDB from "@/app/utils/database";
import { NextRequest, NextResponse } from "next/server"


export async function GET(request: NextRequest, { params }: { params: Promise<{ boardId: string }> }) {
  await connectDB()
  const { boardId } = await params;
  // .select('-password') 비밀번호는 빼고 조회
  const replyInfo = await BoardReply.findOne({board_id: boardId});

  return NextResponse.json(replyInfo)
}