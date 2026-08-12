"use client";

import React, { memo, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/app/providers/I18nProvider";

export type QuizAnswerItem = {
  questionNo: number;
  answer: number;
  selectedAnswer: number;
};

type QuizScoreDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  questions: QuizAnswerItem[];
  anchorPrefix: string;
};

const QuizScoreDialog = (props: QuizScoreDialogProps) => {
  const { open, onOpenChange, title, questions, anchorPrefix } = props;
  const { t } = useTranslations();

  const answered = useMemo(
    () => questions.filter((item) => item.answer),
    [questions],
  );

  const correctCount = useMemo(
    () => answered.filter((item) => item.answer === item.selectedAnswer).length,
    [answered],
  );

  const wrongCount = answered.length - correctCount;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-hidden sm:max-w-lg" showCloseButton>
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">{title}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-3">
          <div className="app-score-stat">
            <span className="app-score-stat-label">{t("quiz.total")}</span>
            <span className="app-score-stat-value app-score-stat-value--total">
              {answered.length}
            </span>
          </div>
          <div className="app-score-stat">
            <span className="app-score-stat-label">{t("quiz.correct")}</span>
            <span className="app-score-stat-value app-score-stat-value--correct">
              {correctCount}
            </span>
          </div>
          <div className="app-score-stat">
            <span className="app-score-stat-label">{t("quiz.wrong")}</span>
            <span className="app-score-stat-value app-score-stat-value--wrong">
              {wrongCount}
            </span>
          </div>
        </div>

        <div className="max-h-64 overflow-y-auto rounded-lg border border-border">
          <table className="app-score-table">
            <thead>
              <tr>
                <th>{t("quiz.number")}</th>
                <th>{t("quiz.choice")}</th>
                <th>{t("quiz.correctShort")}</th>
                <th>{t("quiz.goTo")}</th>
              </tr>
            </thead>
            <tbody>
              {answered.map((item) => {
                const isCorrect = item.selectedAnswer === item.answer;
                return (
                  <tr key={`score-${item.questionNo}`}>
                    <th>{item.questionNo}</th>
                    <td>
                      {isCorrect ? (
                        <span className="app-score-badge--correct">
                          {item.selectedAnswer}: {t("quiz.correctShort")}
                        </span>
                      ) : (
                        <span className="app-score-badge--wrong">
                          {item.selectedAnswer}: {t("quiz.wrongShort")}
                        </span>
                      )}
                    </td>
                    <td>{item.answer}</td>
                    <td>
                      <a
                        href={`#${anchorPrefix}${item.questionNo}`}
                        className="app-btn-primary inline-block px-3 py-1 text-xs"
                        onClick={() => onOpenChange(false)}
                      >
                        {t("quiz.goTo")}
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <DialogFooter className="flex-row justify-stretch gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onOpenChange(false)}
          >
            {t("common.cancel")}
          </Button>
          <Button className="flex-1" onClick={() => onOpenChange(false)}>
            {t("common.confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default memo(QuizScoreDialog);
