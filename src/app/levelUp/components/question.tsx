import React, {memo} from "react";
import { useLevelUpStore } from '@/app/store/levelUpStore';
import CardLevelUpQuestion from "@/app/components/Cards/CardLevelUpQuestion";
import CardLevelUpContent from "@/app/components/Cards/CardLevelUpContent";
import CardLevelUpAnswer from "@/app/components/Cards/CardLevelUpAnswer";

type QuestionProps = {
  questionInfo: any
}

const Question = (props:QuestionProps) => {
  const {questionInfo} = props;
  const {classification, question, questionNo, questionType, choices, answer, sentence, selectedAnswer, speaker} = questionInfo;

  const setLevelUpAnswer = useLevelUpStore((state:any) => state.setLevelUpAnswer);
  const showAnswer = useLevelUpStore((state:any) => state.showAnswer);
  const showReadButton = useLevelUpStore((state:any) => state.showReadButton);
  const showTransButton = useLevelUpStore((state:any) => state.showTransButton);
  const showSpeakButton = useLevelUpStore((state:any) => state.showSpeakButton);

  const handleClick = (selectedData: any) => {
    setLevelUpAnswer(selectedData);
  }

  const sharedProps = {
    classification,
    showReadButton,
    showTransButton,
    showSpeakButton,
    speaker,
    sentence,
    question,
  };

  return (
    <>
      {questionType === 'group' && (
        <CardLevelUpQuestion
          {...sharedProps}
          questionType={questionType}
        />
      )}
      {questionType === 'content' && (
        <CardLevelUpContent
          {...sharedProps}
          questionType={questionType}
        />
      )}
      {questionType === 'normal' && (
        <>
          <CardLevelUpQuestion
            {...sharedProps}
            questionType={questionType}
            id={`levelup-question-${questionNo}`}
            questionNo={questionNo}
          />
          {choices && (
            <CardLevelUpAnswer
              onClick={handleClick}
              questionNo={questionNo}
              choices={choices}
              answer={answer}
              showAnswer={showAnswer}
              selectedAnswer={selectedAnswer}
            />
          )}
        </>
      )}
    </>
  );
}

export default memo(Question);
