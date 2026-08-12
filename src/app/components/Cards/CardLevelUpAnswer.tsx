import { sortBy } from "lodash";
import React, {memo, useCallback} from "react";

type LevelUpAnswerProps = {
  questionNo: number,
  choices: Array<any>,
  answer: number,
  selectedAnswer: number,
  showAnswer: boolean,
  onClick?: (data: any) => any,
}

const CardLevelUpAnswer = (props:LevelUpAnswerProps) => {
  const {questionNo, choices, answer, selectedAnswer, showAnswer = false, onClick} = props;

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

    return collectClass
  }, [selectedAnswer, showAnswer, answer]);

  return (
    <>
      <div className="flex-auto mb-2">
        {choices && sortBy(choices, 'no').map((item, idx) => {
          return item.content ? (
            <div key={`question-answer-${questionNo}-${idx + 1}`}
              className={getCollectClassName(idx + 1)}>
              <input checked={(idx + 1) === selectedAnswer} onChange={(e) => handleClick(idx + 1)} id={`default-radio-${questionNo}-${idx + 1}`} type="radio" value={`${idx + 1}`} name={`${questionNo}`} className="mt-0.5 size-4 shrink-0 accent-brand-600" />
              <label htmlFor={`default-radio-${questionNo}-${idx + 1}`} className="flex-1 cursor-pointer">{parseHtml(`${item?.content}`)}</label>
            </div>
          ) : null;
        })}
      </div>
    </>
  );
}

export default memo(CardLevelUpAnswer);
