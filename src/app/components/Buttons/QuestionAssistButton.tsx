"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type QuestionAssistKind = "read" | "sentence" | "translation" | "pronunciation";

const ASSIST_ICONS: Record<QuestionAssistKind, string> = {
  read: "fas fa-book-open",
  sentence: "fas fa-align-left",
  translation: "fas fa-language",
  pronunciation: "fas fa-volume-up",
};

type QuestionAssistButtonProps = {
  kind: QuestionAssistKind;
  label: string;
  active: boolean;
  onClick: () => void;
  className?: string;
};

export default function QuestionAssistButton({
  kind,
  label,
  active,
  onClick,
  className,
}: QuestionAssistButtonProps) {
  return (
    <Button
      type="button"
      variant={active ? "default" : "outline"}
      size="sm"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "gap-1.5 transition-colors",
        active
          ? "border-primary shadow-sm"
          : "border-primary text-primary hover:bg-primary/10 hover:text-primary",
        className,
      )}
    >
      <i className={ASSIST_ICONS[kind]} aria-hidden />
      <span>{label}</span>
    </Button>
  );
}
