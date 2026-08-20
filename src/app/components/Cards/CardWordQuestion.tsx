"use client";

import React, {memo, useState} from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import SpeechPlayer from "@/app/components/Audio/SpeechPlayer";
import { useTranslations } from "@/app/providers/I18nProvider";
import { recordQuizAttempt } from "@/app/lib/record-quiz-attempt";

type WordQuestionType = {
  question: string,
  choice: Array<string>,
  answer: number,
}

type JlptContentProps = {
  questionInfo: WordQuestionType
  sentence_read?: string,
  sentence_translate?: string,
  speaker?: string,
  record?: {
    subject: string;
    source: string;
    sourceId: string;
    level?: string;
  },
}

const CardWordQuestion = (props:JlptContentProps) => {
  const { questionInfo, sentence_read, sentence_translate, speaker, record } = props;
  const { question, choice, answer } = questionInfo;
  const { t } = useTranslations();
  const [ showAnswer, setShowAnswer ] = useState(false);
  const [ selectedAnswer, setSelectedAnswer ] = useState(0);
  const [ collect, setCollect ] = useState(false);
  const [openTranslate, setOpenTranslate] = useState(false);
  const [openRead, setOpenRead] = useState(false);
  const [openSpeaker, setOpenSpeaker] = useState(false);

  const toggleOpenTranslate = () => setOpenTranslate((cur) => !cur);
  const toggleOpenRead = () => setOpenRead((cur) => !cur);
  const toggleOpenSpeaker = () => setOpenSpeaker((cur) => !cur);

  const parseHtml = (html: string) => {
    return <div dangerouslySetInnerHTML={{ __html: html.replaceAll('\\r\\n', '<br>').replaceAll('\\n', '<br>').replaceAll(/\s/g, "&nbsp;") }} />;
  };

  const handleClickAnswer = (selectedAnswer: number) => {
    setSelectedAnswer(selectedAnswer);
    setCollect(answer === selectedAnswer);
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
            selectedAnswer,
          },
        ],
      });
    }
  }

  const handleClickAnswerClose = () => {
    setShowAnswer(!showAnswer);
  }

  return (
    <>
      <Card className="w-full">
        <CardContent>
          <div className="flex flex-wrap mb-2 font-normal mx-auto text-md">
            {parseHtml(question)}
            {sentence_translate && (
              <span><Button onClick={toggleOpenTranslate} className="px-2 py-1 inline">{t('common.translation')}</Button></span>
            )}
            {sentence_read && (
              <span><Button onClick={toggleOpenRead} className="px-2 py-1 inline ml-1">{t('common.read')}</Button></span>
            )}
            {speaker && (
              <span><Button onClick={toggleOpenSpeaker} className="px-2 py-1 inline ml-1">{t('common.pronunciation')}</Button></span>
            )}
          </div>
          {openTranslate && (
            <div className="app-reveal my-1">
              <div className="app-reveal-panel py-2 px-3">
                <p>{sentence_translate}</p>
              </div>
            </div>
          )}
          {openRead && (
            <div className="app-reveal my-1">
              <div className="app-reveal-panel py-2 px-3">
                <p>{sentence_read}</p>
              </div>
            </div>
          )}
          {openSpeaker && speaker && (
            <div className="my-1.5">
              <SpeechPlayer src={speaker} />
            </div>
          )}
          <div className="flex flex-col">
            {choice.map((item, idx) => {
              return (
                <label key={idx} className="inline-flex items-center gap-2 py-1 cursor-pointer">
                  <input
                    type="radio"
                    name={question}
                    onClick={() => handleClickAnswer(idx + 1)}
                    className="accent-blue-500"
                  />
                  {parseHtml(item) || ''}
                </label>
              );
            })}
          </div>
        </CardContent>
        <CardFooter className={`pt-0 ${showAnswer ? '' : 'hidden'}`}>
          <div className={`relative w-full flex items-center bg-${collect ? 'green' : 'red'}-500 text-white text-sm font-bold px-4 py-3 rounded-md`} role="alert">
            <p>{collect ? t('quiz.correctShort') : t('quiz.wrongShort')}</p>
            <button onClick={(e) => handleClickAnswerClose()} className="flex items-center justify-center transition-all w-8 h-8 rounded-md text-white hover:bg-white/10 active:bg-white/10 absolute top-1.5 right-1.5" type="button">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-5 w-5" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
        </CardFooter>
      </Card>
    </>
  );
}

export default memo(CardWordQuestion);
