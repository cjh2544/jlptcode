"use client";

import React, { memo, useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import SpeechPlayer from "@/app/components/Audio/SpeechPlayer";
import QuestionAssistButton from "@/app/components/Buttons/QuestionAssistButton";
import { useTranslations } from "@/app/providers/I18nProvider";
import { recordQuizAttempt } from "@/app/lib/record-quiz-attempt";
import { cn } from "@/lib/utils";

type WordQuestionType = {
  question: string;
  choice: Array<string>;
  answer: number | string | null | undefined;
};

type JlptContentProps = {
  questionInfo: WordQuestionType;
  sentence_read?: string;
  sentence_translate?: string;
  speaker?: string;
  record?: {
    subject: string;
    source: string;
    sourceId: string;
    level?: string;
  };
};

function normalizeAnswer(value: unknown): number {
  const parsed = Number.parseInt(String(value ?? ""), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

const CardWordQuestion = (props: JlptContentProps) => {
  const { questionInfo, sentence_read, sentence_translate, speaker, record } = props;
  const { question, choice = [] } = questionInfo;
  const answer = useMemo(() => normalizeAnswer(questionInfo.answer), [questionInfo.answer]);
  const { t } = useTranslations();
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(0);
  const [collect, setCollect] = useState(false);
  const [openTranslate, setOpenTranslate] = useState(false);
  const [openRead, setOpenRead] = useState(false);
  const [openSpeaker, setOpenSpeaker] = useState(false);

  const hasRead = Boolean(String(sentence_read ?? "").trim());
  const hasTranslate = Boolean(String(sentence_translate ?? "").trim());
  const hasSpeaker = Boolean(String(speaker ?? "").trim());
  const hasAssist = hasRead || hasTranslate || hasSpeaker;

  useEffect(() => {
    setShowAnswer(false);
    setSelectedAnswer(0);
    setCollect(false);
    setOpenTranslate(false);
    setOpenRead(false);
    setOpenSpeaker(false);
  }, [question, answer, record?.sourceId]);

  const toggleOpenTranslate = () => setOpenTranslate((cur) => !cur);
  const toggleOpenRead = () => setOpenRead((cur) => !cur);
  const toggleOpenSpeaker = () => setOpenSpeaker((cur) => !cur);

  const parseHtml = (html: string) => {
    return (
      <div
        dangerouslySetInnerHTML={{
          __html: html
            .replaceAll("\\r\\n", "<br>")
            .replaceAll("\\n", "<br>")
            .replaceAll(/\s/g, "&nbsp;"),
        }}
      />
    );
  };

  const handleClickAnswer = (nextAnswer: number) => {
    if (selectedAnswer > 0 || !answer) return;

    setSelectedAnswer(nextAnswer);
    setCollect(answer === nextAnswer);
    setShowAnswer(true);

    if (record?.sourceId) {
      recordQuizAttempt({
        subject: record.subject,
        source: record.source,
        level: record.level,
        questions: [
          {
            id: record.sourceId,
            answer,
            selectedAnswer: nextAnswer,
          },
        ],
      });
    }
  };

  const handleClickAnswerClose = () => {
    setShowAnswer(false);
  };

  const choiceClassName = (idx: number) => {
    if (!showAnswer || !selectedAnswer) return "";
    const choiceNo = idx + 1;
    if (choiceNo === answer) return "rounded-md bg-green-50 ring-1 ring-green-300";
    if (choiceNo === selectedAnswer) return "rounded-md bg-red-50 ring-1 ring-red-300";
    return "opacity-70";
  };

  return (
    <>
      <Card className="w-full">
        <CardContent>
          <div className="mb-3 flex flex-col gap-2 text-md font-normal">
            <div>{parseHtml(question)}</div>
            {hasAssist && (
              <div className="app-question-tools">
                {hasRead && (
                  <QuestionAssistButton
                    kind="read"
                    active={openRead}
                    label={t("common.read")}
                    onClick={toggleOpenRead}
                  />
                )}
                {hasTranslate && (
                  <QuestionAssistButton
                    kind="translation"
                    active={openTranslate}
                    label={t("common.translation")}
                    onClick={toggleOpenTranslate}
                  />
                )}
                {hasSpeaker && (
                  <QuestionAssistButton
                    kind="pronunciation"
                    active={openSpeaker}
                    label={t("common.pronunciation")}
                    onClick={toggleOpenSpeaker}
                  />
                )}
              </div>
            )}
          </div>
          {openTranslate && hasTranslate && (
            <div className="app-reveal my-1.5">
              <div className="app-reveal-panel">
                {parseHtml(sentence_translate || "")}
              </div>
            </div>
          )}
          {openRead && hasRead && (
            <div className="app-reveal my-1.5">
              <div className="app-reveal-panel">
                {parseHtml(sentence_read || "")}
              </div>
            </div>
          )}
          {openSpeaker && hasSpeaker && (
            <div className="app-reveal my-1.5">
              <div className="app-reveal-panel p-3">
                <SpeechPlayer
                  src={speaker || ""}
                  fallbackText={sentence_read || question}
                />
              </div>
            </div>
          )}
          <div className="flex flex-col">
            {choice.map((item, idx) => {
              const choiceNo = idx + 1;
              return (
                <label
                  key={idx}
                  className={cn(
                    "inline-flex cursor-pointer items-center gap-2 py-1",
                    choiceClassName(idx),
                    selectedAnswer > 0 ? "cursor-default" : "",
                  )}
                >
                  <input
                    type="radio"
                    name={`${record?.sourceId ?? "question"}-${question}`}
                    checked={selectedAnswer === choiceNo}
                    readOnly
                    disabled={selectedAnswer > 0}
                    onClick={() => handleClickAnswer(choiceNo)}
                    className="accent-blue-500"
                  />
                  {parseHtml(item) || ""}
                </label>
              );
            })}
          </div>
        </CardContent>
        <CardFooter className={`pt-0 ${showAnswer ? "" : "hidden"}`}>
          <div
            className={cn(
              "relative flex w-full items-center rounded-md px-4 py-3 text-sm font-bold text-white",
              collect ? "bg-green-500" : "bg-red-500",
            )}
            role="alert"
          >
            <p>
              {collect
                ? t("quiz.correctShort")
                : t("quiz.wrongShort")}
              {!collect && answer > 0 && (
                <span className="ml-2 font-normal">
                  ({t("quiz.choice")}: {answer})
                </span>
              )}
            </p>
            <button
              onClick={handleClickAnswerClose}
              className="absolute top-1.5 right-1.5 flex h-8 w-8 items-center justify-center rounded-md text-white transition-all hover:bg-white/10 active:bg-white/10"
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-5 w-5"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </CardFooter>
      </Card>
    </>
  );
};

export default memo(CardWordQuestion);
