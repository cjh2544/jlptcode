"use client";
import BoardLayout from "@/app/components/Layout/BoardLayout";
import List from "@/app/board/components/list";
import BoardTitle from "@/app/board/components/boardTitle";
import { useTranslations } from "@/app/providers/I18nProvider";

const BoardCommunityPage = () => {
  const { t } = useTranslations();

  return (
    <BoardLayout>
      <BoardTitle title={t('board.title')} visibleButton={true} buttonTitle={t('board.ask')} />
      <List />
    </BoardLayout>
  )
}

export default BoardCommunityPage
