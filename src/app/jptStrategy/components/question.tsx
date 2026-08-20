import React, {memo} from "react";
import { useJptStore } from '@/app/store/jptStore';
import CardLevelUpQuestion from "@/app/components/Cards/CardLevelUpQuestion";
import CardLevelUpContent from "@/app/components/Cards/CardLevelUpContent";
import CardLevelUpAnswer from "@/app/components/Cards/CardLevelUpAnswer";

type QuestionProps = {
  questionInfo: any
}

const Question = (props:QuestionProps) => {
  const {questionInfo} = props;
  const {classification, question, questionNo, questionType, choices, answer, sentence, selectedAnswer, speaker} = questionInfo;

  const setJptAnswer = useJptStore((state:any) => state.setJptAnswer);
  const showAnswer = useJptStore((state:any) => state.showAnswer);
  const showReadButton = useJptStore((state:any) => state.showReadButton);
  const showTransButton = useJptStore((state:any) => state.showTransButton);
  const showSpeakButton = useJptStore((state:any) => state.showSpeakButton);

  const handleClick = (selectedData: any) => {
    setJptAnswer(selectedData);
  }

  const hideSpeak = classification === "listening";
  const toolProps = {
    classification,
    showReadButton,
    showTransButton,
    showSpeakButton: hideSpeak ? false : showSpeakButton,
    speaker,
    sentence,
    question,
  };

  return (
    <>
      {questionType === 'group' && (
        <CardLevelUpQuestion {...toolProps} questionType={questionType} />
      )}
      {questionType === 'content' && (
        <CardLevelUpContent {...toolProps} questionType={questionType} />
      )}
      {questionType === 'normal' && (
        <>
          <CardLevelUpQuestion
            {...toolProps}
            questionType={questionType}
            id={`jpt-question-${questionNo}`}
            questionNo={questionNo}
          />
          {choices && <CardLevelUpAnswer onClick={handleClick} questionNo={questionNo} choices={choices} answer={answer} showAnswer={showAnswer} selectedAnswer={selectedAnswer} />}
        </>
      )}
    </>
  );
}

export default memo(Question);
