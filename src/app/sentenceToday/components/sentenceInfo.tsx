'use client';
import React, {memo} from "react";
import { Button, Tooltip, Typography } from "@material-tailwind/react";
import CardJlptQuestion from "@/app/components/Cards/CardJlptQuestion";
import CardWordQuestion from "@/app/components/Cards/CardWordQuestion";
import { playSpeech } from "@/app/utils/openai";

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
    hideSentence = false,
    hideSentenceRead = false,
    hideSentenceTranslate = false
  } = wordInfo;

  const handleClick = (colType: string) => {
    let visibleInfo = {};

    if('sentence' === colType) {
      visibleInfo = { hideSentence: !hideSentence };
    } else if('sentence_read' === colType) {
      visibleInfo = { hideSentenceRead: !hideSentenceRead };
    } else if('sentence_translate' === colType) {
      visibleInfo = { hideSentenceTranslate: !hideSentenceTranslate };
    }

    onClick && onClick({...wordInfo, ...visibleInfo});
  }

  const handleShowQuestion = () => {
    onClick && onClick({...wordInfo, showQuestion: !wordInfo.showQuestion });
  }

  const handleGetSpeech = (read: string) => {
    playSpeech(read);
  }

  const parseHtml = (html: string) => {
    if(html) {
      return <div dangerouslySetInnerHTML={{ __html: html.replaceAll('\\r\\n', '<br>').replaceAll('\\n', '<br>').replaceAll(/\s/g, "&nbsp;") }} />;
    } else {
      return <></>;
    }
  };

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
              <div className="flex justify-between items-center border-b">
                <div className={`${hideSentence ? 'invisible' : ''}`}>{parseHtml(sentence)}</div>
                <p>
                  {/* <button onClick={(e) => handleGetSpeech(sentence_read)} className="text-blue-500 focus:outline-none mr-1">
                    <i className="fa-solid fa-volume-high"></i>
                  </button> */}
                  <button onClick={(e) => handleClick('sentence')} className="text-blue-500 focus:outline-none">
                    <i className={`${hideSentence ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash'}`}></i>
                  </button>
                </p>
              </div>
              <div className="flex justify-between items-center border-b">
                <div className={`${hideSentenceRead ? 'invisible' : ''}`}>{parseHtml(sentence_read)}</div>
                <button onClick={(e) => handleClick('sentence_read')} className="text-blue-500 focus:outline-none">
                  <i className={`${hideSentenceRead ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash'}`}></i>
                </button>
              </div>
              <div className="flex justify-between items-center">
                <div className={`${hideSentenceTranslate ? 'invisible' : ''}`}>{parseHtml(sentence_translate)}</div>
                <button onClick={(e) => handleClick('sentence_translate')} className="text-blue-500 focus:outline-none">
                  <i className={`${hideSentenceTranslate ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash'}`}></i>
                </button>
              </div>
            </div> 
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
      {showQuestion && (
        <tr className="even:bg-blue-gray-50/50">
          <td colSpan={4} className="p-4 border-b border-blue-gray-50">
            <CardWordQuestion questionInfo={question} />
          </td>
        </tr>
      )}
    </>
  );
}

export default memo(SentenceInfo);
