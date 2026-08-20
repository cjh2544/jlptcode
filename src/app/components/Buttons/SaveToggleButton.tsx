"use client";

import { savedKey, useSavedWords } from "@/app/swr/useMypage";
import ModalConfirm from "@/app/components/Modals/ModalConfirm";
import { useTranslations } from "@/app/providers/I18nProvider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { signIn, useSession } from "next-auth/react";
import { useState } from "react";

type SaveToggleButtonProps = {
  source: string;
  sourceId: string;
  snapshot?: Record<string, unknown>;
  compact?: boolean;
  className?: string;
};

export default function SaveToggleButton({
  source,
  sourceId,
  snapshot,
  compact,
  className,
}: SaveToggleButtonProps) {
  const { t } = useTranslations();
  const { data: session, status } = useSession();
  const savedWords = useSavedWords();
  const [pending, setPending] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const saved = savedWords.keys.has(savedKey(source, sourceId));
  const label = saved ? t("mypage.savedDone") : t("mypage.save");

  const toggle = async () => {
    if (status === "unauthenticated" || !session) {
      signIn();
      return;
    }

    setPending(true);
    try {
      const response = await fetch("/api/mypage/saved-word", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source, sourceId, ...snapshot }),
      });
      if (response.status === 401) {
        signIn();
        return;
      }
      await savedWords.mutate();
    } finally {
      setPending(false);
    }
  };

  const handleClick = () => {
    if (status === "unauthenticated" || !session) {
      signIn();
      return;
    }
    if (saved) {
      setShowConfirm(true);
      return;
    }
    void toggle();
  };

  return (
    <>
      <Button
        type="button"
        variant={saved ? "secondary" : "outline"}
        size={compact ? "icon-sm" : "sm"}
        onClick={handleClick}
        disabled={pending}
        className={cn(compact ? "" : "gap-1.5", className)}
        title={label}
        aria-label={label}
      >
        <i className={saved ? "fas fa-bookmark" : "far fa-bookmark"} aria-hidden />
        {!compact && <span>{label}</span>}
      </Button>
      <ModalConfirm
        type="warning"
        message={t("mypage.unsaveConfirm")}
        visible={showConfirm}
        showCancel
        onClose={() => setShowConfirm(false)}
        onConfirm={toggle}
      />
    </>
  );
}
