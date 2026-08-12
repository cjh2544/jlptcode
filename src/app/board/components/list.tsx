"use client";

import React, { memo, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import PaginationNew from "@/app/components/Navbars/PaginationNew";
import { useBoardCommunityStore } from "@/app/store/boardCommunityStore";
import LoadingSkeleton from "@/app/components/Loading/loadingSkeleton";
import BoardRowInfo from "./boardRowInfo";
import BoardNoticeRoll from "./BoardNoticeRoll";
import { isEmpty } from "lodash";
import EmptyData from "@/app/components/Alert/EmptyData";
import { useTranslations } from "@/app/providers/I18nProvider";

type BoardListProps = {
  level?: string;
  onSearch?: (data: any) => any;
  onClick?: (data: any) => any;
};

const BoardList = (props: BoardListProps) => {
  const { t } = useTranslations();
  const router = useRouter();
  const pageInfo = useBoardCommunityStore((state: any) => state.pageInfo);
  const boardList = useBoardCommunityStore((state: any) => state.boardList);
  const isLoading = useBoardCommunityStore((state: any) => state.isLoading);
  const setPageInfo = useBoardCommunityStore((state: any) => state.setPageInfo);
  const getBoardList = useBoardCommunityStore(
    (state: any) => state.getBoardList,
  );
  const getBoardInfo = useBoardCommunityStore(
    (state: any) => state.getBoardInfo,
  );

  const { notices, posts } = useMemo(() => {
    const noticeItems: Board[] = [];
    const postItems: Board[] = [];

    for (const item of boardList || []) {
      if (item?.noticeYn === "Y") noticeItems.push(item);
      else postItems.push(item);
    }

    return { notices: noticeItems, posts: postItems };
  }, [boardList]);

  const handlePageChange = async (newPageNo: number) => {
    if (!pageInfo || newPageNo === pageInfo.currentPage) return;

    setPageInfo({ currentPage: newPageNo });
    await getBoardList();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClickDetail = (boardInfo: Board) => {
    getBoardInfo(boardInfo);
    router.push("view", { scroll: false });
  };

  useEffect(() => {
    getBoardList();
  }, []);

  return (
    <div className="app-panel-body">
      {!isLoading && (
        <BoardNoticeRoll notices={notices} onClickDetail={handleClickDetail} />
      )}

      <div className="overflow-x-auto rounded-lg border border-[var(--border)]">
        <table className="app-board-table min-w-full">
          <thead>
            <tr>
              <th className="w-auto">{t("board.subject")}</th>
              <th className="hidden w-28 sm:table-cell">{t("board.author")}</th>
              <th className="hidden w-44 md:table-cell">
                {t("board.createdAt")}
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={3} className="!p-0">
                  <LoadingSkeleton />
                </td>
              </tr>
            ) : isEmpty(posts) ? (
              <tr>
                <td colSpan={3} className="!p-6">
                  <EmptyData />
                </td>
              </tr>
            ) : (
              posts.map((boardInfo: Board, idx: number) => (
                <BoardRowInfo
                  key={boardInfo._id || idx}
                  onClickDetail={handleClickDetail}
                  boardInfo={boardInfo}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
      <PaginationNew
        pageInfo={pageInfo}
        onPageChange={(newPage: number) => handlePageChange(newPage)}
      />
    </div>
  );
};

export default memo(BoardList);
