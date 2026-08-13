"use client";
import BoardLayout from "@/app/components/Layout/BoardLayout";
import BoardWrite from "@/app/board/components/write";
import BoardTitle from "@/app/board/components/boardTitle";
import { useTranslations } from "@/app/providers/I18nProvider";

const BoardCommunityPage = () => {
  const { t } = useTranslations();

  return (
    <BoardLayout>
      <BoardTitle title={t('board.title')} />
      <BoardWrite />
    </BoardLayout>
  )
}

export default BoardCommunityPage
