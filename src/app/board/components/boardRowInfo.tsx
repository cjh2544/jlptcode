"use client";

import React, { memo, MouseEvent, useEffect, useState } from "react";
import CardBoardDetailInfo from "@/app/components/Cards/CardBoardDetailInfo";
import { isEmpty } from "lodash";
import { formatInSeoul } from "@/app/utils/common";
import { useTranslations } from "@/app/providers/I18nProvider";

type BoardRowInfoProps = {
  boardInfo: Board;
  onClickReply?: () => void;
  onClickDetail?: (boardInfo: Board) => void;
};

const BoardRowInfo = (props: BoardRowInfoProps) => {
  const { t } = useTranslations();
  const { boardInfo, onClickDetail } = props;
  const [showReply, setShowReply] = useState(false);

  const replyInfo = boardInfo.replyInfo;
  const hasReply = Boolean(boardInfo.hasReply) || !isEmpty(replyInfo);

  const handleClickDetail = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    onClickDetail?.(boardInfo);
  };

  useEffect(() => {
    setShowReply(false);
  }, [boardInfo._id]);

  const isNotice = boardInfo?.noticeYn === "Y";

  return (
    <>
      <tr className={isNotice ? "app-board-row--notice" : undefined}>
        <td>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleClickDetail}
              className="max-w-full cursor-pointer truncate text-left text-sm font-medium text-[var(--foreground)] underline-offset-4 hover:text-[var(--primary)] hover:underline"
            >
              {boardInfo.title}
            </button>
            {isNotice && (
              <span className="app-board-badge app-board-badge--notice">
                {t("board.notice")}
              </span>
            )}
            {hasReply && (
              <button
                type="button"
                onClick={() => setShowReply(!showReply)}
                className="app-board-badge app-board-badge--reply"
              >
                {t("board.replied")}
              </button>
            )}
          </div>
          <div className="mt-1 flex gap-3 text-xs text-[var(--muted-foreground)] sm:hidden">
            <span>{boardInfo.name}</span>
            <span>
              {formatInSeoul(boardInfo.createdAt, "yyyy-MM-dd HH:mm")}
            </span>
          </div>
        </td>
        <td className="hidden sm:table-cell">
          <span className="text-sm text-[var(--foreground)]">
            {boardInfo.name}
          </span>
        </td>
        <td className="hidden md:table-cell">
          <span className="text-sm tabular-nums text-[var(--muted-foreground)]">
            {formatInSeoul(boardInfo.createdAt, "yyyy-MM-dd HH:mm")}
          </span>
        </td>
      </tr>
      {showReply && hasReply && (
        <tr>
          <td colSpan={3} className="!bg-[var(--muted)] !p-4">
            <CardBoardDetailInfo
              boardInfo={boardInfo}
              replyInfo={replyInfo || undefined}
            />
          </td>
        </tr>
      )}
    </>
  );
};

export default memo(BoardRowInfo);
