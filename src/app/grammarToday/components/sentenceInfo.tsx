'use client';
import React, {memo} from "react";
import CardWordQuestion from "@/app/components/Cards/CardWordQuestion";
import { playSpeech } from "@/app/utils/openai";

type SentenceInfoProps = {
  sentenceInfo: any
  onClick?: any
}

const SentenceInfo = (props:SentenceInfoProps) => {
  const { 
    sentenceInfo, 
    onClick
  } = props;
  const { 
    level, 
    year, 
    sortNo, 
    sentence, 
    sentence_read, 
    sentence_translate,
    question,
    showQuestion = false,
    hideSentence = false,
    hideSentenceRead = false,
    hideSentenceTranslate = false
  } = sentenceInfo;

  const handleClick = (colType: string) => {
    let visibleInfo = {};

    if('sentence' === colType) {
      visibleInfo = { hideSentence: !hideSentence };
    } else if('sentence_read' === colType) {
      visibleInfo = { hideSentenceRead: !hideSentenceRead };
    } else if('sentence_translate' === colType) {
      visibleInfo = { hideSentenceTranslate: !hideSentenceTranslate };
    }

    onClick && onClick({...sentenceInfo, ...visibleInfo});
  }

  const handleShowQuestion = () => {
    onClick && onClick({...sentenceInfo, showQuestion: !sentenceInfo.showQuestion });
  }

  const handleGetSpeech = (read: string) => {
    playSpeech(read);
  }

  const parseHtml = (html: string, sentenceType?: string) => {
    let pHtml = html;

    pHtml = pHtml.replaceAll(/\s/g, "&nbsp;");
    pHtml = pHtml.replaceAll('\\r\\n', '<br>');
    pHtml = pHtml.replaceAll('\\n', '<br>');

    // 문장일 경우 괄호 빨강으로 표시
    if(sentenceType === 'sentence') {
      pHtml = pHtml.replace(/\([^)]+\)/g, (str) => '<span class="text-red-600">' + str + '</span>');
      pHtml = pHtml.replace(/\（[^)]+\）/g, (str) => '<span class="text-red-600">' + str + '</span>');
    }
   
    return <div dangerouslySetInnerHTML={{ __html: pHtml }} />;
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
            {sortNo}
          </div>
        </td>
        <td className="p-4 border-b border-blue-gray-50">
          <div className="font-normal">
            <div className="flex flex-col">
              <div className="flex justify-between items-center">
                <div className={`${hideSentence ? 'invisible' : ''}`}>{parseHtml(sentence, 'sentence')}</div>
                <p>
                  {/* <button onClick={(e) => handleGetSpeech(sentence_read)} className="text-blue-500 focus:outline-none mr-1">
                    <i className="fa-solid fa-volume-high"></i>
                  </button> */}
                  <button onClick={(e) => handleClick('sentence')} className="text-blue-500 focus:outline-none">
                    <i className={`${hideSentence ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash'}`}></i>
                  </button>
                </p>
              </div>
              <div className="flex justify-between items-center">
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
