"use client";

import React, { memo, MouseEvent, useCallback } from "react";
import { useBoardCommunityStore } from "@/app/store/boardCommunityStore";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useTranslations } from "@/app/providers/I18nProvider";
import { formatInSeoul } from "@/app/utils/common";
import { isEmpty } from "lodash";
import { Button } from "@/components/ui/button";
import { MessageSquareReply, Pencil, List, User, Calendar } from "lucide-react";

const BoardView = () => {
  const { t } = useTranslations();

  const { data: session } = useSession();
  const boardInfo: Board = useBoardCommunityStore(
    (state: any) => state.boardInfo,
  );
  const replyInfo: BoardReply = useBoardCommunityStore(
    (state: any) => state.replyInfo,
  );

  const handleLinkActive = (event: MouseEvent<HTMLAnchorElement>) => {
    if (session?.user?.email !== boardInfo.email) event.preventDefault();
  };

  const isMyWrite = useCallback(() => {
    return (
      session?.user?.email && session?.user?.email === boardInfo.email
    );
  }, [boardInfo, session]);

  const isAdmin = useCallback(() => {
    return session?.user?.role && session?.user?.role?.includes("admin");
  }, [session]);

  const hasReply = !isEmpty(replyInfo) && Boolean(replyInfo?.contents);
  const isNotice = boardInfo?.noticeYn === "Y";

  return (
    <div className="app-board-view">
      <header className="app-board-view-header">
        <div className="flex flex-wrap items-center gap-2">
          {isNotice && (
            <span className="app-board-badge app-board-badge--notice">
              {t("board.notice")}
            </span>
          )}
          {hasReply && (
            <span className="app-board-badge app-board-badge--reply">
              {t("board.replied")}
            </span>
          )}
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {t("board.viewTitle")}
          </span>
        </div>
        <h1 className="app-board-view-title">{boardInfo.title || ""}</h1>
        <div className="app-board-view-meta">
          <span className="inline-flex items-center gap-1.5">
            <User className="size-3.5" aria-hidden />
            {boardInfo.name || "-"}
          </span>
          <span className="inline-flex items-center gap-1.5 tabular-nums">
            <Calendar className="size-3.5" aria-hidden />
            {formatInSeoul(
              boardInfo.updatedAt || boardInfo.createdAt,
              "yyyy-MM-dd HH:mm",
            )}
          </span>
        </div>
      </header>

      <section className="app-board-view-body" aria-label={t("board.content")}>
        <p className="app-board-view-label">{t("board.content")}</p>
        <div className="app-board-view-content">
          {boardInfo.contents || ""}
        </div>
      </section>

      {hasReply && (
        <section className="app-board-view-reply" aria-label={t("board.reply")}>
          <div className="app-board-view-reply-head">
            <h2 className="app-board-view-reply-title">
              <MessageSquareReply className="size-4" aria-hidden />
              {t("board.reply")}
            </h2>
            <time className="tabular-nums text-xs text-muted-foreground">
              {formatInSeoul(
                replyInfo?.updatedAt || replyInfo?.createdAt,
                "yyyy-MM-dd HH:mm",
              )}
            </time>
          </div>
          <div className="app-board-view-content app-board-view-content--reply">
            {replyInfo?.contents || ""}
          </div>
        </section>
      )}

      <footer className="app-board-view-actions">
        {isAdmin() && (
          <Button asChild variant="default" size="default" className="gap-1.5">
            <Link href="reply" scroll={false}>
              <MessageSquareReply className="size-4" aria-hidden />
              {t("board.replyAction")}
            </Link>
          </Button>
        )}
        {isMyWrite() && (
          <Button asChild variant="secondary" size="default" className="gap-1.5">
            <Link onClick={handleLinkActive} href="modify" scroll={false}>
              <Pencil className="size-4" aria-hidden />
              {t("board.editAction")}
            </Link>
          </Button>
        )}
        <Button asChild variant="outline" size="default" className="gap-1.5">
          <Link href="list" scroll={false}>
            <List className="size-4" aria-hidden />
            {t("common.list")}
          </Link>
        </Button>
      </footer>
    </div>
  );
};

export default memo(BoardView);
