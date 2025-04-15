import React, {memo} from "react";
import { useLevelUpStore } from '@/app/store/levelUpStore';
import CardLevelUpQuestion from "@/app/components/Cards/CardLevelUpQuestion";
import CardLevelUpContent from "@/app/components/Cards/CardLevelUpContent";
import CardLevelUpAnswer from "@/app/components/Cards/CardLevelUpAnswer";
import CardAudio from "@/app/components/Cards/CardAudio";
import CardImage from "@/app/components/Cards/CardImage";
import { useJlptStore } from "@/app/store/jlptStore";

type QuestionProps = {
  questionInfo: any
}

const Question = (props:QuestionProps) => {
  const {questionInfo} = props;
  const {year, month, level, classification, question, questionNo, questionType, choices, answer, sentence, selectedAnswer} = questionInfo;

  const setLevelUpAnswer = useLevelUpStore((state) => state.setLevelUpAnswer);
  const showAnswer = useLevelUpStore((state) => state.showAnswer);

  const handleClick = (selectedData: any) => {
    setLevelUpAnswer(selectedData);
  }

  return (
    <>
      {questionType === 'group' && <CardLevelUpQuestion questionType={questionType} question={question} />}
      {questionType === 'content' && <CardLevelUpContent questionType={questionType} question={question} sentence={sentence} />}
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
