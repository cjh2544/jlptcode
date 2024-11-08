'use client';
import React, {memo} from "react";
import { Button, Tooltip, Typography } from "@material-tailwind/react";
import CardJlptQuestion from "@/app/components/Cards/CardJlptQuestion";
import CardWordQuestion from "@/app/components/Cards/CardWordQuestion";

type SentenceInfoProps = {
  wordInfo: any
  onClick?: any
}

const SentenceInfo = (props:SentenceInfoProps) => {
  const { 
    wordInfo, 
    onClick
  } = props;
  const { 
    level, 
    year, 
    wordNo, 
    word, 
    read, 
    means, 
    sentence, 
    sentence_read, 
    sentence_translate,
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

  return (
    <>
      <tr className="even:bg-blue-gray-50/50">
        <td className="p-4 border-b border-blue-gray-50">
          <div className="font-normal">
            {year}
          </div> 
        </td>
        <td className="p-4 border-b border-blue-gray-50">
          <div className="font-normal">
            {wordNo}
          </div>
        </td>
        <td className="p-4 border-b border-blue-gray-50">
          <div className="font-normal">
            <div className="flex flex-col">
              <p>{sentence}</p>
              <p>{sentence_read}</p>
              <p>{sentence_translate}</p>
            </div> 
          </div>
        </td>
        <td className="p-4 border-b border-blue-gray-50">
          <div className="font-normal">
            <button onClick={(e) => handleShowQuestion()} className="text-blue-600 focus:outline-none">
              [読み方]
            </button>
          </div> 
        </td>
        <td className="p-4 border-b border-blue-gray-50">
          <div className="font-normal">
            <button onClick={(e) => handleShowQuestion()} className="text-blue-600 focus:outline-none">
              [意味]
            </button> 
          </div> 
        </td>
        <td className="p-4 border-b border-blue-gray-50">
          <div className="font-normal">
            <button onClick={(e) => handleShowQuestion()} className="text-blue-600 focus:outline-none">
              [確認]
            </button>
          </div>
        </td>
      </tr>
    </>
  );
}

export default memo(SentenceInfo);
