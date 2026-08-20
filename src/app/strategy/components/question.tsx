import React, {memo} from "react";
import { useStrategyStore } from '@/app/store/strategyStore';
import CardLevelUpQuestion from "@/app/components/Cards/CardLevelUpQuestion";
import CardLevelUpContent from "@/app/components/Cards/CardLevelUpContent";
import CardLevelUpAnswer from "@/app/components/Cards/CardLevelUpAnswer";

type QuestionProps = {
  questionInfo: any
  hideTools?: boolean
}

const Question = (props:QuestionProps) => {
  const {questionInfo, hideTools = false} = props;
  const {classification, question, questionNo, questionType, choices, answer, sentence, selectedAnswer, speaker, sentence_locale} = questionInfo;

  const setLevelUpAnswer = useStrategyStore((state:any) => state.setLevelUpAnswer);
  const showAnswer = useStrategyStore((state:any) => state.showAnswer);
  const showReadButton = useStrategyStore((state:any) => state.showReadButton);
  const showTransButton = useStrategyStore((state:any) => state.showTransButton);
  const showSpeakButton = useStrategyStore((state:any) => state.showSpeakButton);
  const { year: searchYear } = useStrategyStore((state:any) => state.levelUpInfo);

  const handleClick = (selectedData: any) => {
    setLevelUpAnswer(selectedData);
  }

  const hideSpeak =
    classification === "grammar" ||
    classification === "reading" ||
    classification === "listening";
  const toolProps = {
    showReadButton: hideTools ? false : showReadButton,
    showTransButton: hideTools ? false : showTransButton,
    showSpeakButton: hideTools || hideSpeak ? false : showSpeakButton,
  };

  return (
    <>
      {questionType === 'group' && <CardLevelUpQuestion classification={classification} questionType={questionType} question={question} sentence={sentence}
            {...toolProps}
            speaker={speaker}
            sentence_locale={sentence_locale} />}
      {questionType === 'content' && <CardLevelUpContent classification={classification} questionType={questionType} question={question} sentence={sentence}
            {...toolProps}
            speaker={speaker}
            sentence_locale={sentence_locale} />}
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
            id={`levelup-question-${searchYear ? '' : questionNo}`} sentence={sentence}
            classification={classification}
            {...toolProps}
            speaker={speaker}
            sentence_locale={sentence_locale} />
          {choices && <CardLevelUpAnswer onClick={handleClick} questionNo={questionNo} choices={choices} answer={answer} showAnswer={showAnswer} selectedAnswer={selectedAnswer} />}
        </>
      )}
    </>
  );
}

export default memo(Question);
