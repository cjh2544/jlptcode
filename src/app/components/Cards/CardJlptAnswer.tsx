import React, {memo, useCallback, useMemo} from "react";
import { orderExamChoices } from "@/app/lib/content-shape";

type JlptAnswerProps = {
  questionNo: number,
  choices: Array<any>,
  answer: number,
  selectedAnswer: number,
  showAnswer: boolean,
  onClick?: (data: any) => any,
}

const CardJlptAnswer = (props:JlptAnswerProps) => {
  const {questionNo, choices, answer, selectedAnswer, showAnswer = false, onClick} = props;
  const orderedChoices = useMemo(() => orderExamChoices(choices), [choices]);

  const handleClick = (selectedAnswer: number) => {
    onClick && onClick({questionNo, selectedAnswer});
  }

  const parseHtml = (html: string) => {
    return <span dangerouslySetInnerHTML={{ __html: html.replaceAll('\\r\\n', '<br>').replaceAll('\\n', '<br>').replaceAll(/\s/g, "&nbsp;") }} />;
  };

  const getCollectClassName = useCallback((ansNo: number) => {
    let collectClass = 'app-answer-choice';

    if(showAnswer) {
      if(ansNo === selectedAnswer) {
        if(answer === selectedAnswer) {
          collectClass = 'app-answer-choice app-answer-choice--correct';
        } else {
          collectClass = 'app-answer-choice app-answer-choice--wrong';
        }
      }
    }

    return collectClass;
  }, [selectedAnswer, showAnswer, answer]);

  return (
    <>
      <div className="flex-auto mb-2">
        {orderedChoices.map((item, idx) => {
          const choiceNo = item.no || idx + 1;
          return item.content ? (
            <div key={`question-answer-${questionNo}-${choiceNo}`}
              className={getCollectClassName(choiceNo)}>
              <input checked={choiceNo === selectedAnswer} onChange={() => handleClick(choiceNo)} id={`default-radio-${questionNo}-${choiceNo}`} type="radio" value={`${choiceNo}`} name={`${questionNo}`} className="mt-0.5 size-4 shrink-0 accent-brand-600" />
              <label htmlFor={`default-radio-${questionNo}-${choiceNo}`} className="flex-1 cursor-pointer">{parseHtml(`${item?.content}`)}</label>
            </div>
          ) : null;
        })}
      </div>
    </>
  );
}

export default memo(CardJlptAnswer);
