"use client";

import { useState } from "react";
import MypagePanel from "@/app/mypage/components/MypagePanel";
import SaveToggleButton from "@/app/components/Buttons/SaveToggleButton";
import ModalConfirm from "@/app/components/Modals/ModalConfirm";
import { useSavedWords } from "@/app/swr/useMypage";
import { useTranslations } from "@/app/providers/I18nProvider";
import { Button } from "@/components/ui/button";

function sourceLabel(t: (key: string) => string, source: string) {
  if (source === "wordToday") return t("mypage.sourceWordToday");
  if (source === "jptWord") return t("mypage.sourceJptWord");
  return t("mypage.sourceWord");
}

export default function SavedWordsPage() {
  const { t } = useTranslations();
  const { items, isLoading, mutate } = useSavedWords();
  const [showConfirm, setShowConfirm] = useState(false);
  const [pending, setPending] = useState(false);

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
          <ul className="divide-y divide-border">
            {items.map((item: any) => (
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
