"use client"; // 필수!
import { signIn, signOut, useSession } from "next-auth/react";
import BoardLayout from "@/app/components/Layout/BoardLayout";
import BoardReply from "@/app/board/components/reply";
import BoardTitle from "@/app/board/components/boardTitle";

const BoardCommunityPage = () => {

  const { data: session } = useSession();

  return (
    <BoardLayout>
      <BoardTitle title="문의 게시판" />
      <BoardReply />
    </BoardLayout>
  )
}

export default BoardCommunityPage