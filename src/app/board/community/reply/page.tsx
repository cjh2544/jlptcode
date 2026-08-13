"use client";
import BoardLayout from "@/app/components/Layout/BoardLayout";
import BoardReply from "@/app/board/components/reply";
import BoardTitle from "@/app/board/components/boardTitle";
import { useTranslations } from "@/app/providers/I18nProvider";

const BoardCommunityPage = () => {
  const { t } = useTranslations();

  return (
    <BoardLayout>
      <BoardTitle title={t('board.title')} />
      <BoardReply />
    </BoardLayout>
  )
}

export default BoardCommunityPage
