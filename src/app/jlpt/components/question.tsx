import CardJlptAnswer from "@/app/components/Cards/CardJlptAnswer";
import CardJlptContent from "@/app/components/Cards/CardJlptContent";
import CardJlptQuestion from "@/app/components/Cards/CardJlptQuestion";
import React, {memo} from "react";
import { useJlptStore } from '@/app/store/jlptStore';

type QuestionProps = {
  questionInfo: any
}

const Question = (props:QuestionProps) => {
  const {questionInfo} = props;
  const {year, month, level, classification, question, questionNo, questionType, choices, answer, sentence, selectedAnswer} = questionInfo;

  const setJlptAnswer = useJlptStore((state) => state.setJlptAnswer);
  const showAnswer = useJlptStore((state) => state.showAnswer);

  const handleClick = (selectedData: any) => {
    setJlptAnswer(selectedData);
  }

  return (
    <>
      {questionType === 'group' && <CardJlptQuestion questionType={questionType} question={question} sentence={sentence} />}
      {questionType === 'content' && <CardJlptContent questionType={questionType} question={question} sentence={sentence} />}
      {questionType === 'normal' && (
        <>
          <CardJlptQuestion classification={classification} questionType={questionType} question={question} sentence={sentence} id={`jlpt-question-${questionNo}`} />
          <CardJlptAnswer showAnswer={showAnswer} onClick={handleClick} questionNo={questionNo} choices={choices} answer={answer} selectedAnswer={selectedAnswer} />
        </>
      )}
    </>
  );
}

export default memo(Question);
