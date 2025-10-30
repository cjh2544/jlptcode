'use client';
import React, {memo, useEffect} from "react";
import { Button, Tooltip, Typography } from "@material-tailwind/react";
import CardJlptQuestion from "@/app/components/Cards/CardJlptQuestion";
import CardWordQuestion from "@/app/components/Cards/CardWordQuestion";
import { playSpeech } from "@/app/utils/openai";
import GoogleTts from "@/app/components/Audio/GoogleTTS";

type WordInfoProps = {
  wordInfo: any
  onClick?: any
}

const WordInfo = (props:WordInfoProps) => {
  const { 
    wordInfo, 
    onClick
  } = props;
  const { 
    _id,
    level, 
    year, 
    study,
    wordNo, 
    word, 
    read, 
    means, 
    sentence, 
    sentence_read, 
    sentence_translate,
    speaker,
    question,
    showQuestion = false,
    hideWord = false,
    hideRead = false,
    hideMeans = false

  } = wordInfo;

  const handleClick = (colType: string) => {
    let visibleInfo = {};

    if('word' === colType) {
      visibleInfo = { hideWord: !hideWord };
    } else if('read' === colType) {
      visibleInfo = { hideRead: !hideRead };
    } else if('means' === colType) {
      visibleInfo = { hideMeans: !hideMeans };
    }

    onClick && onClick({...wordInfo, ...visibleInfo});
  }

  const handleShowQuestion = () => {
    onClick && onClick({...wordInfo, showQuestion: !wordInfo.showQuestion });
  }

  const handleGetSpeech = (read: string) => {
    playSpeech(read);
  }

  useEffect(() => {
    // console.log(wordInfo)
  }, [wordInfo])

  return (
    <>
      <tr className="even:bg-blue-gray-50/50">
        <td className="p-4 border-b border-blue-gray-50">
          <div className="font-normal uppercase">
            {study}
          </div> 
        </td>
        <td className="p-4 border-b border-blue-gray-50">
          <div className="font-normal">
            {wordNo}
          </div>
        </td>
        <td className="p-4 border-b border-blue-gray-50">
          <div className="font-normal">
            <div className="flex justify-between items-center">
              <div className={`${hideWord ? 'invisible' : ''}`}>{word}</div>
              <div>
                {/* <button onClick={(e) => handleGetSpeech(read)} className="text-blue-500 focus:outline-none mr-1">
                  <i className="fa-solid fa-volume-high"></i>
                </button> */}
                {/* <GoogleTts id={_id} text={word} /> */}
                <button onClick={(e) => handleClick('word')} className="text-blue-500 focus:outline-none">
                  <i className={`${hideWord ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash'}`}></i>
                </button>
              </div>
            </div> 
          </div>
        </td>
        <td className="p-4 border-b border-blue-gray-50">
          <div className="font-normal">
            <div className="flex justify-between items-center">
              <p className={`${hideRead ? 'invisible' : ''}`}>{read}</p>
              <button onClick={(e) => handleClick('read')} className="text-blue-500 focus:outline-none">
                <i className={`${hideRead ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash'}`}></i>
              </button>
            </div> 
          </div> 
        </td>
        <td className="p-4 border-b border-blue-gray-50">
          <div className="font-normal">
            <div className="flex justify-between items-center">
              <p className={`${hideMeans ? 'invisible' : ''}`}>{means}</p>
              <button onClick={(e) => handleClick('means')} className="text-blue-500 focus:outline-none">
                <i className={`${hideMeans ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash'}`}></i>
              </button>
            </div> 
          </div> 
        </td>
        <td className="p-4 border-b border-blue-gray-50">
          <div className="font-normal">
            {level !== 'N0' && (
              <button onClick={(e) => handleShowQuestion()} className="text-blue-600 focus:outline-none">
                [確認]
              </button>
            )}
          </div>
        </td>
      </tr>
      {showQuestion && (
        <tr className="even:bg-blue-gray-50/50">
          <td colSpan={6} className="p-4 border-b border-blue-gray-50">
            <CardWordQuestion questionInfo={question} speaker={speaker} sentence_read={sentence_read} sentence_translate={sentence_translate} />
          </td>
        </tr>
      )}
    </>
  );
}

export default memo(WordInfo);
