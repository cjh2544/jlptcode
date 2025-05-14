import React, {memo} from "react";
import { useStrategyStore } from '@/app/store/strategyStore';
import CardLevelUpQuestion from "@/app/components/Cards/CardLevelUpQuestion";
import CardLevelUpContent from "@/app/components/Cards/CardLevelUpContent";
import CardLevelUpAnswer from "@/app/components/Cards/CardLevelUpAnswer";

type QuestionProps = {
  questionInfo: any
}

const Question = (props:QuestionProps) => {
  const {questionInfo} = props;
  const {year, month, level, classification, question, questionNo, questionType, choices, answer, sentence, selectedAnswer} = questionInfo;

  const setLevelUpAnswer = useStrategyStore((state) => state.setLevelUpAnswer);
  const showAnswer = useStrategyStore((state) => state.showAnswer);
  const { year: searchYear } = useStrategyStore((state) => state.levelUpInfo);

  const handleClick = (selectedData: any) => {
    setLevelUpAnswer(selectedData);
  }

  return (
    <>
      {questionType === 'group' && <CardLevelUpQuestion questionType={questionType} question={question} sentence={sentence} />}
      {questionType === 'content' && <CardLevelUpContent questionType={questionType} question={question} sentence={sentence} />}
      {questionType === 'normal' && (
        <>
          <CardLevelUpQuestion questionType={questionType}
            question={
              {
                ...question,
                content: searchYear ? question.contentOrg : question.content,
              }  
            }
            questionNo={searchYear ? '' : questionNo}
            id={`levelup-question-${searchYear ? '' : questionNo}`} sentence={sentence} />
          {choices && <CardLevelUpAnswer onClick={handleClick} questionNo={questionNo} choices={choices} answer={answer} showAnswer={showAnswer} selectedAnswer={selectedAnswer} />}
        </>
      )}
    </>
  );
}

export default memo(Question);
