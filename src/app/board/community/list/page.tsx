"use client"; // 필수!
import { signIn, signOut, useSession } from "next-auth/react";
import BoardLayout from "@/app/components/Layout/BoardLayout";
import List from "@/app/board/components/list";
import BoardTitle from "@/app/board/components/boardTitle";

const BoardCommunityPage = () => {

  const { data: session } = useSession();

  return (
    <BoardLayout>
      <BoardTitle title="문의 게시판" visibleButton={true} buttonTitle="문의하기" />
      <List />
    </BoardLayout>
  )
}

export default BoardCommunityPage