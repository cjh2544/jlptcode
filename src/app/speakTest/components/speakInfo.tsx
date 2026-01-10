'use client';
import React, {memo, useEffect} from "react";
import { Button, Card, Tooltip, Typography } from "@material-tailwind/react";
import CardJlptQuestion from "@/app/components/Cards/CardJlptQuestion";
import CardWordQuestion from "@/app/components/Cards/CardWordQuestion";
import { playSpeech } from "@/app/utils/openai";
import GoogleTts from "@/app/components/Audio/GoogleTTS";
import CardAudio from "@/app/components/Cards/CardAudio";

type SpeakInfoProps = {
  wordInfo: any
  onClick?: any
}

const SpeakInfo = (props:SpeakInfoProps) => {
  const { 
    wordInfo, 
    onClick
  } = props;
  const { 
    _id,
    level, 
    year, 
    wordNo, 
    word, 
    read, 
    means, 
    keyword,
    sentence, 
    sentence_read, 
    sentence_translate,
    speaker,
    question,
    showQuestion = false,
    hideSentence = true,
    hideSentenceRead = true,
    hideSentenceTranslate = false,
    hideKeyword = false,
    hideSpeaker = false,
  } = wordInfo;

  const handleClick = (colType: string) => {
    let visibleInfo = {};

    if('sentence' === colType) {
      visibleInfo = { hideSentence: !hideSentence };
    } else if('sentence_read' === colType) {
      visibleInfo = { hideSentenceRead: !hideSentenceRead };
    } else if('sentence_translate' === colType) {
      visibleInfo = { hideSentenceTranslate: !hideSentenceTranslate };
    } else if('keyword' === colType) {
      visibleInfo = { hideKeyword: !hideKeyword };
    }

    onClick && onClick({...wordInfo, ...visibleInfo});
  }

  const parseHtml = (html: string) => {
    if(html) {
      return <div dangerouslySetInnerHTML={{ __html: html.replaceAll('\\r\\n', '<br>').replaceAll('\\n', '<br>').replaceAll(/\s/g, "&nbsp;") }} />;
    } else {
      return <></>;
    }
  };

  useEffect(() => {
    // console.log(wordInfo)
  }, [wordInfo])

  return (
    <>
      <li className="py-3 sm:py-4">
        <div>
          <h4 className="text-lg font-bold text-gray-800">
            {parseHtml(sentence_translate)}
          </h4>
        </div>
        <div className="flex items-center">
          <div className="flex-1 min-w-0 mt-1">
            <div className={`${hideSpeaker ? 'hidden' : ''}`}>
              <CardAudio audio={{name: '', link: speaker}} />
            </div>
            <div className={`text-sm font-medium bg-blue-200 p-2 text-gray-900 ${hideKeyword ? 'hidden' : ''}`}>
              {keyword && parseHtml(`∎${keyword}`)}
              <p className="text-red-800 font-bold mt-2">※ 키워드를 활용해서 최대한 일본어로 말해 보세요.</p>
            </div>
            <div className={`text-sm font-medium bg-blue-100 p-2 text-gray-900 ${hideSentence ? 'hidden' : ''}`}>
              {sentence && parseHtml(sentence)}
            </div>
            <div className={`text-sm font-medium bg-blue-50 p-2 text-gray-900 ${hideSentenceRead ? 'hidden' : ''}`}>
              {sentence_read && parseHtml(sentence_read)}
            </div>
          </div>
        </div>
      </li>
    </>
  );
}

export default memo(SpeakInfo);
