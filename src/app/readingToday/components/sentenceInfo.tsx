'use client';
import React, {memo} from "react";
import { Button, Tooltip, Typography } from "@material-tailwind/react";
import CardJlptQuestion from "@/app/components/Cards/CardJlptQuestion";
import CardWordQuestion from "@/app/components/Cards/CardWordQuestion";
import { playSpeech } from "@/app/utils/openai";

type SentenceInfoProps = {
  readingInfo: any
  onClick?: any
}

const SentenceInfo = (props:SentenceInfoProps) => {
  const { 
    readingInfo, 
    onClick
  } = props;
  const { 
    level, 
    source, 
    sort, 
    sentence, 
    sentence_read, 
    sentence_translate,
    hideSentence = false,
    hideSentenceRead = false,
    hideSentenceTranslate = false
  } = readingInfo;

  const handleClick = (colType: string) => {
    let visibleInfo = {};

    if('sentence' === colType) {
      visibleInfo = { hideSentence: false, hideSentenceTranslate: true };
    } else if('sentence_read' === colType) {
      visibleInfo = { hideSentenceRead: !hideSentenceRead };
    } else if('sentence_translate' === colType) {
      visibleInfo = { hideSentence: true, hideSentenceTranslate: false };
    }

    onClick && onClick({...readingInfo, ...visibleInfo});
  }

  const handleShowQuestion = () => {
    onClick && onClick({...readingInfo, showQuestion: !readingInfo.showQuestion });
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
      <div className="mb-4 border-b border-gray-200">
          <ul className="flex flex-wrap -mb-px text-sm font-medium text-center" id="default-tab" data-tabs-toggle="#default-tab-content" role="tablist">
              <li className="me-2" role="presentation">
                  <button onClick={(e) => handleClick('sentence')} className={`inline-block p-4 rounded-t-lg ${hideSentence ? 'hover:text-gray-600 hover:border-gray-300' : 'border-blue-600 border-b-2'}`} id="profile-tab" data-tabs-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected="false">문장</button>
              </li>
              <li className="me-2" role="presentation">
                  <button onClick={(e) => handleClick('sentence_translate')} className={`inline-block p-4 rounded-t-lg ${hideSentenceTranslate ? 'hover:text-gray-600 hover:border-gray-300' : 'border-blue-600 border-b-2'}`} id="dashboard-tab" data-tabs-target="#dashboard" type="button" role="tab" aria-controls="dashboard" aria-selected="false">해석</button>
              </li>
          </ul>
      </div>
      <div id="default-tab-content">
          <div className={`p-4 rounded-lg bg-gray-501 ${hideSentence ? 'hidden' : ''}`} id="profile" role="tabpanel" aria-labelledby="profile-tab">
            {parseHtml(sentence)}
          </div>
          <div className={`p-4 rounded-lg bg-gray-50 ${hideSentenceTranslate ? 'hidden' : ''}`} id="dashboard" role="tabpanel" aria-labelledby="dashboard-tab">
            {parseHtml(sentence_translate)}
          </div>
      </div>
    </>
  );
}

export default memo(SentenceInfo);
