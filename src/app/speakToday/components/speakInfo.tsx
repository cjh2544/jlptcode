'use client';
import React, {memo, useEffect} from "react";
import { Button, Card, Tooltip, Typography } from "@material-tailwind/react";
import CardJlptQuestion from "@/app/components/Cards/CardJlptQuestion";
import CardWordQuestion from "@/app/components/Cards/CardWordQuestion";
import { playSpeech } from "@/app/utils/openai";
import GoogleTts from "@/app/components/Audio/GoogleTTS";

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
    question,
    showQuestion = false,
    hideSentence = true,
    hideSentenceRead = true,
    hideSentenceTranslate = false,
    hideKeyword = false,
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
        <div className="flex items-center">
          <div className="flex-1 min-w-0 ms-4">
            <h4 className="text-lg font-bold text-gray-800 dark:text-white">
              {parseHtml(sentence_translate)}
            </h4>
            <p className={`text-sm font-medium text-gray-900 truncate dark:text-white ${hideKeyword ? 'invisible' : ''}`}>
              {parseHtml(keyword)}
            </p>
            <p className={`text-sm font-medium text-gray-900 truncate dark:text-white ${hideSentence ? 'invisible' : ''}`}>
              {parseHtml(sentence)}
            </p>
            <p className={`text-sm font-medium text-gray-900 truncate dark:text-white ${hideSentenceRead ? 'invisible' : ''}`}>
              {parseHtml(sentence_read)}
            </p>
          </div>
          <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
            <div className="max-w-xs flex flex-col rounded-lg shadow-2xs">
              <button type="button" onClick={(e) => handleClick('keyword')} className="py-3 px-4 inline-flex items-center gap-x-2 rounded-t-md text-sm font-medium focus:z-10 border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800">
                <i className={`${hideKeyword ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash'}`}></i>키워드
              </button>
              <button type="button" onClick={(e) => handleClick('sentence')} className="-mt-px py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium focus:z-10 border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800">
                <i className={`${hideSentence ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash'}`}></i>문장
              </button>
              <button type="button" onClick={(e) => handleClick('sentence_read')} className="-mt-px py-3 px-4 inline-flex items-center gap-x-2 rounded-b-md text-sm font-medium focus:z-10 border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800">
                <i className={`${hideSentenceRead ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash'}`}></i>읽기
              </button>
            </div>
          </div>
        </div>
      </li>
    </>
  );
}

export default memo(SpeakInfo);
