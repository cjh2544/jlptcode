"use client";

import React, { memo } from "react";
import { useTranslations } from "@/app/providers/I18nProvider";

type WordCardProps = {
  wordInfo: any;
  wordShowType?: string;
  showDelay?: any;
  fullScreen: boolean;
};

const WordCard = (props: WordCardProps) => {
  const { wordInfo, fullScreen = false } = props;
  const { t } = useTranslations();

  if (!wordInfo) return null;

  const meaning = Array.isArray(wordInfo?.means)
    ? wordInfo.means.join("\n")
    : wordInfo?.means;

  return (
    <div
      className={`${fullScreen ? "h-[calc(100vh-88px)]" : "min-h-96 h-[28rem]"} word-slide-card flex flex-col items-center justify-center px-6 py-10 text-center sm:px-12`}
    >
      <div className="flex w-full max-w-3xl flex-col items-center gap-6">
        <div
          className={`${wordInfo.hideWord ? "invisible" : ""} word-slide-word w-full`}
        >
          <p className="mb-2 text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-[var(--muted-foreground)]">
            {t("word.word")}
          </p>
          <h3 className="break-words text-4xl font-bold leading-tight tracking-tight text-[var(--foreground)] sm:text-5xl">
            {wordInfo?.word || " "}
          </h3>
        </div>

        <div
          className={`${wordInfo.hideRead ? "invisible" : ""} word-slide-read w-full border-t border-[var(--border)] pt-6`}
        >
          <p className="mb-2 text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-[var(--muted-foreground)]">
            {t("word.reading")}
          </p>
          <h3 className="break-words text-2xl font-medium leading-snug text-[color-mix(in_oklab,var(--primary)_70%,var(--foreground))] sm:text-3xl">
            {wordInfo?.read || " "}
          </h3>
        </div>

        <div
          className={`${wordInfo.hideMeans ? "invisible" : ""} word-slide-means w-full`}
        >
          <p className="mb-3 text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-[var(--muted-foreground)]">
            {t("word.meaning")}
          </p>
          <div className="rounded-xl border border-[color-mix(in_oklab,var(--primary)_14%,var(--border))] bg-[color-mix(in_oklab,var(--primary)_6%,var(--card))] px-5 py-4">
            <h3 className="whitespace-pre-line break-words text-xl font-medium leading-relaxed text-[var(--foreground)] sm:text-2xl">
              {meaning || " "}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(WordCard);
