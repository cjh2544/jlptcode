import React, {memo} from "react";
import { useLevelUpStore } from '@/app/store/levelUpNewStore';
import CardLevelUpQuestion from "@/app/components/Cards/CardLevelUpQuestion";
import CardLevelUpAnswer from "@/app/components/Cards/CardLevelUpAnswer";
import CardLevelUpContent from "@/app/components/Cards/CardLevelUpContent";

type QuestionProps = {
  questionInfo: any
}

const Question = (props:QuestionProps) => {
  const {questionInfo} = props;
  const {year, month, level, classification, question, questionNo, questionType, choices, answer, selectedAnswer} = questionInfo;

  const setLevelUpAnswer = useLevelUpStore((state) => state.setLevelUpAnswer);
  const showAnswer = useLevelUpStore((state) => state.showAnswer);

  const handleClick = (selectedData: any) => {
    setLevelUpAnswer(selectedData);
  }

  return (
    <>
      {questionType === 'group' && <CardLevelUpQuestion questionType={questionType} question={question} />}
      {questionType === 'content' && <CardLevelUpContent question={question} />}
      {questionType === 'normal' && (
        <>
          <CardLevelUpQuestion questionType={questionType} question={question} id={`levelup-question-${questionNo}`} questionNo={questionNo} />
          {choices && <CardLevelUpAnswer onClick={handleClick} questionNo={questionNo} choices={choices} answer={answer} showAnswer={showAnswer} selectedAnswer={selectedAnswer} />}
        </>
      )}
    </>
  );
}

export default memo(Question);
