"use client";

import { useMemo, useState } from "react";
import MypagePanel from "@/app/mypage/components/MypagePanel";
import SaveToggleButton from "@/app/components/Buttons/SaveToggleButton";
import ModalConfirm from "@/app/components/Modals/ModalConfirm";
import { useSavedWords } from "@/app/swr/useMypage";
import { useTranslations } from "@/app/providers/I18nProvider";
import { Button } from "@/components/ui/button";

const LEVELS = ["N1", "N2", "N3", "N4", "N5"] as const;

const SOURCE_OPTIONS = [
  "all",
  "wordToday",
  "sentenceToday",
  "grammarToday",
  "word",
  "jptWord",
] as const;

type SourceFilter = (typeof SOURCE_OPTIONS)[number];

function sourceLabel(t: (key: string) => string, source: string) {
  if (source === "wordToday") return t("mypage.sourceWordToday");
  if (source === "sentenceToday") return t("mypage.sourceSentenceToday");
  if (source === "grammarToday") return t("mypage.sourceGrammarToday");
  if (source === "jptWord") return t("mypage.sourceJptWord");
  return t("mypage.sourceWord");
}

function sourceFilterLabel(t: (key: string) => string, source: SourceFilter) {
  if (source === "all") return t("mypage.filterAll");
  return sourceLabel(t, source);
}

export default function SavedWordsPage() {
  const { t } = useTranslations();
  const { items, isLoading, mutate } = useSavedWords();
  const [showConfirm, setShowConfirm] = useState(false);
  const [pending, setPending] = useState(false);
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>("all");
  const [levelFilter, setLevelFilter] = useState<string>("all");

  const filteredItems = useMemo(() => {
    return items.filter((item: any) => {
      if (sourceFilter !== "all" && item.source !== sourceFilter) return false;
      if (levelFilter !== "all" && item.level !== levelFilter) return false;
      return true;
    });
  }, [items, sourceFilter, levelFilter]);

  const deleteAll = async () => {
    setPending(true);
    try {
      await fetch("/api/mypage/saved-word", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ all: true }),
      });
      await mutate();
    } finally {
      setPending(false);
    }
  };

  return (
    <>
      <MypagePanel
        titleKey="mypage.savedWords"
        actions={
          items.length > 0 ? (
            <Button
              type="button"
              size="sm"
              variant="secondary"
              disabled={pending}
              onClick={() => setShowConfirm(true)}
              className="h-9 shrink-0 gap-1.5 bg-white/15 text-white hover:bg-white/25 hover:text-white"
            >
              <i className="fas fa-trash-alt" aria-hidden />
              {t("mypage.deleteAllWords")}
            </Button>
          ) : undefined
        }
      >
        {isLoading ? (
          <p className="text-sm text-muted-foreground">{t("common.processing")}</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("common.noData")}</p>
        ) : (
          <>
            <div className="mb-4 flex flex-wrap items-end gap-3">
              <label className="flex min-w-[140px] flex-col gap-1 text-sm">
                <span className="text-muted-foreground">{t("mypage.filterSource")}</span>
                <select
                  value={sourceFilter}
                  onChange={(e) => setSourceFilter(e.target.value as SourceFilter)}
                  className="h-9 rounded-md border border-input bg-background px-2 text-sm"
                >
                  {SOURCE_OPTIONS.map((source) => (
                    <option key={source} value={source}>
                      {sourceFilterLabel(t, source)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex min-w-[100px] flex-col gap-1 text-sm">
                <span className="text-muted-foreground">{t("mypage.filterLevel")}</span>
                <select
                  value={levelFilter}
                  onChange={(e) => setLevelFilter(e.target.value)}
                  className="h-9 rounded-md border border-input bg-background px-2 text-sm"
                >
                  <option value="all">{t("mypage.filterAll")}</option>
                  {LEVELS.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </label>
              <p className="pb-2 text-sm text-muted-foreground">
                {t("mypage.filterCount").replace("{n}", String(filteredItems.length))}
              </p>
            </div>
            {filteredItems.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t("common.noData")}</p>
            ) : (
              <ul className="divide-y divide-border">
                {filteredItems.map((item: any) => (
                  <li key={item.id || item._id} className="flex items-start justify-between gap-3 py-3">
                    <div className="min-w-0">
                      <div className="mb-1 flex flex-wrap items-center gap-1.5">
                        {item.level && <span className="app-today-badge">{item.level}</span>}
                        <span className="app-today-badge">{sourceLabel(t, item.source)}</span>
                      </div>
                      <p className="text-base font-semibold text-foreground">{item.word}</p>
                      {item.read && <p className="mt-0.5 text-sm text-muted-foreground">{item.read}</p>}
                      {item.means && (
                        <p className="mt-1 whitespace-pre-line text-sm text-foreground">{item.means}</p>
                      )}
                    </div>
                    <SaveToggleButton
                      source={item.source}
                      sourceId={item.sourceId}
                      snapshot={item}
                    />
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </MypagePanel>
      <ModalConfirm
        type="warning"
        message={t("mypage.deleteAllWordsConfirm")}
        visible={showConfirm}
        showCancel
        onClose={() => setShowConfirm(false)}
        onConfirm={deleteAll}
      />
    </>
  );
}
