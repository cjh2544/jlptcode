import { isEmpty } from "lodash";
import React, {memo, useState} from "react";
import { Card, CardBody, CardFooter, CardHeader, Radio, Typography } from "@material-tailwind/react";

type WordQuestionType = {
  question: string,
  choice: Array<string>,
  answer: number,
}

type JlptContentProps = {
  questionInfo: WordQuestionType,
}

const CardWordQuestion = (props:JlptContentProps) => {
  const { questionInfo } = props;
  const { question, choice, answer } = questionInfo;
  const [ showAnswer, setShowAnswer ] = useState(false);
  const [ selectedAnswer, setSelectedAnswer ] = useState(0);
  const [ collect, setCollect ] = useState(false);

  const parseHtml = (html: string) => {
    return <div dangerouslySetInnerHTML={{ __html: html.replaceAll('\\r\\n', '<br>').replaceAll('\\n', '<br>').replaceAll(/\s/g, "&nbsp;") }} />;
  };

  const handleClickAnswer = (selectedAnswer: number) => {
    setSelectedAnswer(selectedAnswer);
    setCollect(answer === selectedAnswer);
    setShowAnswer(true);
  }

  const handleClickAnswerClose = () => {
    setShowAnswer(!showAnswer);
  }

  return (
    <>
      <Card className="w-full">
        <CardBody>
          <p className="mb-2 font-normal mx-auto text-md">
            {parseHtml(question)}
          </p>
          <div className="flex flex-col">
            {choice.map((item, idx) => {
              return <Radio onClick={(e) => handleClickAnswer(idx + 1)} name={question} color="blue" label={item} />
            })}
          </div>
        </CardBody>
        <CardFooter className={`pt-0 ${showAnswer ? '' : 'hidden'}`}>
          <div className={`relative w-full flex items-center bg-${collect ? 'green' : 'red'}-500 text-white text-sm font-bold px-4 py-3 rounded-md`} role="alert">
            <p>{collect ? '正解(정답)' : '誤答(오답)'}</p>
            <button onClick={(e) => handleClickAnswerClose()} className="flex items-center justify-center transition-all w-8 h-8 rounded-md text-white hover:bg-white/10 active:bg-white/10 absolute top-1.5 right-1.5" type="button">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-5 w-5" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
        </CardFooter>
      </Card>
    </>
  );
}

export default memo(CardWordQuestion);
