"use client"; // 필수!
import { signIn, signOut, useSession } from "next-auth/react";
import BoardLayout from "@/app/components/Layout/BoardLayout";
import BoardReply from "@/app/board/components/reply";
import BoardTitle from "@/app/board/components/boardTitle";
import { useTranslations } from "@/app/providers/I18nProvider";

const BoardCommunityPage = () => {

  const { data: session } = useSession();
  const { t } = useTranslations();

  return (
    <BoardLayout>
      <BoardTitle title={t('board.title')} />
      <BoardReply />
    </BoardLayout>
  )
}

export default BoardCommunityPage