"use client"; // 필수!
import { signIn, signOut, useSession } from "next-auth/react";
import BoardLayout from "@/app/components/Layout/BoardLayout";
import BoardModify from "@/app/board/components/modify";
import BoardTitle from "@/app/board/components/boardTitle";
import { useTranslations } from "@/app/providers/I18nProvider";

const BoardCommunityPage = () => {

  const { data: session } = useSession();
  const { t } = useTranslations();

  return (
    <BoardLayout>
      <BoardTitle title={t('board.title')} />
      <BoardModify />
    </BoardLayout>
  )
}

export default BoardCommunityPage