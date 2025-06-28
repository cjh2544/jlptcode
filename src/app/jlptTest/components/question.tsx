import CardJlptAnswer from "@/app/components/Cards/CardJlptAnswer";
import CardJlptContent from "@/app/components/Cards/CardJlptContent";
import CardJlptQuestion from "@/app/components/Cards/CardJlptQuestion";
import React, {memo} from "react";
import { useJlptTestStore } from '@/app/store/jlptTestStore';

type QuestionProps = {
  questionInfo: any
}

const Question = (props:QuestionProps) => {
  const {questionInfo} = props;
  const {test, level, classification, question, questionNo, questionType, choices, answer, sentence, selectedAnswer} = questionInfo;

  const setJlptAnswer = useJlptTestStore((state:any) => state.setJlptAnswer);
  const showAnswer = useJlptTestStore((state:any) => state.showAnswer);
  const showReadButton = useJlptTestStore((state:any) => state.showReadButton);
  const showTransButton = useJlptTestStore((state:any) => state.showTransButton);

  const handleClick = (selectedData: any) => {
    setJlptAnswer(selectedData);
  }

  return (
    <>
      {questionType === 'group' && <CardJlptQuestion showReadButton={showReadButton} showTransButton={showTransButton} questionType={questionType} question={question} sentence={sentence} />}
      {questionType === 'content' && <CardJlptContent showReadButton={showReadButton} showTransButton={showTransButton} questionType={questionType} question={question} sentence={sentence} />}
      {questionType === 'normal' && (
        <>
          <CardJlptQuestion showReadButton={showReadButton} showTransButton={showTransButton} classification={classification} questionType={questionType} question={question} sentence={sentence} id={`jlpt-question-${questionNo}`} />
          <CardJlptAnswer showAnswer={showAnswer} onClick={handleClick} questionNo={questionNo} choices={choices} answer={answer} selectedAnswer={selectedAnswer} />
        </>
      )}
    </>
  );
}

export default memo(Question);
