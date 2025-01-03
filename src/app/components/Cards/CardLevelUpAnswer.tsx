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
    let collectClass = 'text-gray-900';

    if(showAnswer) {
      if(ansNo === selectedAnswer) {
        if(answer === selectedAnswer) {
          collectClass = 'bg-green-500 text-white';
        } else {
          collectClass = 'bg-red-500 text-white';
        }
      }
    }

    return collectClass
  }, [selectedAnswer, showAnswer]);

  return (
    <>
      <div className="flex-auto mb-2">
        {choices && sortBy(choices, 'no').map((item, idx) => {
          return item.content ? (
            <div key={`question-answer-${questionNo}-${idx + 1}`}
              className={`${getCollectClassName(idx + 1)} flex items-center p-2 rounded`}>
              <input checked={(idx + 1) === selectedAnswer} onChange={(e) => handleClick(idx + 1)} id={`default-radio-${questionNo}-${idx + 1}`} type="radio" value={`${idx + 1}`} name={`${questionNo}`} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2" />
              <label htmlFor={`default-radio-${questionNo}-${idx + 1}`} className="ms-2">{parseHtml(`${item?.content}`)}</label>
            </div>
          ) : null;
        })}
      </div>
    </>
  );
}

export default memo(CardLevelUpAnswer);
