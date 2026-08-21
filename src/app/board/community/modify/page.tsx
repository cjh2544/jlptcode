"use client";
import BoardLayout from "@/app/components/Layout/BoardLayout";
import BoardModify from "@/app/board/components/modify";
import BoardTitle from "@/app/board/components/boardTitle";
import { useTranslations } from "@/app/providers/I18nProvider";

const BoardCommunityPage = () => {
  const { t } = useTranslations();

  return (
    <BoardLayout>
      <BoardTitle title={t("board.editAction")} />
      <BoardModify />
    </BoardLayout>
  )
}

export default BoardCommunityPage
