"use client";
import BoardLayout from "@/app/components/Layout/BoardLayout";
import BoardTitle from "@/app/board/components/boardTitle";
import BoardView from "@/app/board/components/view";
import { useTranslations } from "@/app/providers/I18nProvider";

const BoardCommunityPage = () => {
  const { t } = useTranslations();

  return (
    <BoardLayout>
      <BoardTitle title={t('board.title')} />
      <BoardView />
    </BoardLayout>
  )
}

export default BoardCommunityPage
