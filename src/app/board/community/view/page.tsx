"use client"; // 필수!
import { signIn, signOut, useSession } from "next-auth/react";
import BoardLayout from "@/app/components/Layout/BoardLayout";
import BoardTitle from "@/app/board/components/boardTitle";
import BoardView from "@/app/board/components/view";

const BoardCommunityPage = () => {

  const { data: session } = useSession();

  return (
    <BoardLayout>
      <BoardTitle title="문의 게시판" />
      <BoardView />
    </BoardLayout>
  )
}

export default BoardCommunityPage