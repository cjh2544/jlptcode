"use client";

import React, { memo, useEffect, useMemo, useState } from "react";
import { useTranslations } from "@/app/providers/I18nProvider";
import { Button } from "@/components/ui/button";
import { formatInSeoul } from "@/app/utils/common";
import { cn } from "@/lib/utils";

const VISIBLE_COUNT = 3;
const ROLL_INTERVAL_MS = 3500;

type BoardNoticeRollProps = {
  notices: Board[];
  onClickDetail?: (boardInfo: Board) => void;
};

const BoardNoticeRoll = ({ notices, onClickDetail }: BoardNoticeRollProps) => {
  const { t } = useTranslations();
  const [expanded, setExpanded] = useState(false);
  const [offset, setOffset] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  const canRoll = notices.length > VISIBLE_COUNT;

  useEffect(() => {
    setOffset(0);
    setExpanded(false);
  }, [notices]);

  useEffect(() => {
    if (expanded || !canRoll) return;

    const timer = window.setInterval(() => {
      setOffset((prev) => (prev + 1) % notices.length);
      setAnimKey((prev) => prev + 1);
    }, ROLL_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [expanded, canRoll, notices.length]);

  const visibleNotices = useMemo(() => {
    if (expanded || !canRoll) return notices;
    return Array.from({ length: VISIBLE_COUNT }, (_, index) => {
      return notices[(offset + index) % notices.length];
    });
  }, [expanded, canRoll, notices, offset]);

  if (!notices.length) return null;

  return (
    <div className="mb-4 overflow-hidden rounded-lg border border-[color-mix(in_oklab,var(--destructive)_22%,var(--border))] bg-[color-mix(in_oklab,var(--destructive)_5%,var(--card))]">
      <div className="flex items-center justify-between gap-3 border-b border-[color-mix(in_oklab,var(--destructive)_18%,var(--border))] px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="app-board-badge app-board-badge--notice">
            {t("board.notice")}
          </span>
          <span className="text-xs font-semibold text-[var(--muted-foreground)]">
            {t("board.noticeSection")} ({notices.length})
          </span>
        </div>
        {canRoll && (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="h-7 gap-1.5 px-2 text-xs font-semibold text-[var(--foreground)]"
            onClick={() => setExpanded((prev) => !prev)}
          >
            <i
              className={`fas ${expanded ? "fa-chevron-up" : "fa-chevron-down"}`}
              aria-hidden
            />
            {expanded ? t("board.collapse") : t("board.expandAll")}
          </Button>
        )}
      </div>

      <ul
        key={expanded ? "expanded" : `roll-${animKey}`}
        className={cn(
          "divide-y divide-[color-mix(in_oklab,var(--destructive)_12%,var(--border))]",
          !expanded && canRoll && "app-notice-roll-anim",
        )}
      >
        {visibleNotices.map((notice, index) => (
          <li key={`${notice._id}-${index}`}>
            <button
              type="button"
              className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left transition-colors hover:bg-[color-mix(in_oklab,var(--destructive)_8%,transparent)]"
              onClick={() => onClickDetail?.(notice)}
            >
              <span className="min-w-0 flex-1 truncate text-sm font-medium text-[var(--foreground)]">
                {notice.title}
              </span>
              <span className="hidden shrink-0 text-xs tabular-nums text-[var(--muted-foreground)] sm:inline">
                {formatInSeoul(notice.createdAt, "yyyy-MM-dd")}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {!expanded && canRoll && (
        <div className="flex items-center justify-center gap-1.5 border-t border-[color-mix(in_oklab,var(--destructive)_12%,var(--border))] px-3 py-2">
          {notices.map((notice, index) => (
            <button
              key={notice._id || index}
              type="button"
              aria-label={`notice-${index + 1}`}
              className={cn(
                "size-1.5 rounded-full transition-colors",
                index === offset
                  ? "bg-[var(--destructive)]"
                  : "bg-[color-mix(in_oklab,var(--destructive)_25%,var(--border))]",
              )}
              onClick={() => {
                setOffset(index);
                setAnimKey((prev) => prev + 1);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default memo(BoardNoticeRoll);
