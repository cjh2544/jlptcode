import React, {memo} from "react";
import { useJptStore } from '@/app/store/jptStore';
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

  const setJptAnswer = useJptStore((state:any) => state.setJptAnswer);
  const showAnswer = useJptStore((state:any) => state.showAnswer);
  const showReadButton = useJptStore((state:any) => state.showReadButton);
    const showTransButton = useJptStore((state:any) => state.showTransButton);

  const handleClick = (selectedData: any) => {
    setJptAnswer(selectedData);
  }

  return (
    <>
      {questionType === 'group' && <CardLevelUpQuestion showReadButton={showReadButton} showTransButton={showTransButton} questionType={questionType} question={question} sentence={sentence} />}
      {questionType === 'content' && <CardLevelUpContent showReadButton={showReadButton} showTransButton={showTransButton} questionType={questionType} question={question} sentence={sentence} />}
      {questionType === 'normal' && (
        <>
          <CardLevelUpQuestion showReadButton={showReadButton} showTransButton={showTransButton} questionType={questionType} question={question} id={`levelup-question-${questionNo}`} questionNo={questionNo} sentence={sentence} />
          {choices && <CardLevelUpAnswer onClick={handleClick} questionNo={questionNo} choices={choices} answer={answer} showAnswer={showAnswer} selectedAnswer={selectedAnswer} />}
        </>
      )}
    </>
  );
}

export default memo(Question);
