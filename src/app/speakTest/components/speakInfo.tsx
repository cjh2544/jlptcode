'use client';
import React, {memo, useEffect} from "react";
import SpeechPlayer from "@/app/components/Audio/SpeechPlayer";
import { useTranslations } from "@/app/providers/I18nProvider";
import { getLocalizedTranslate } from "@/app/utils/sentenceLocale";

type SpeakInfoProps = {
  wordInfo: any
  onClick?: any
}

const SpeakInfo = (props:SpeakInfoProps) => {
  const { t, locale } = useTranslations();
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
    sentence_locale,
    speaker,
    question,
    showQuestion = false,
    hideSentence = true,
    hideSentenceRead = true,
    hideSentenceTranslate = false,
    hideKeyword = false,
    hideSpeaker = false,
  } = wordInfo;
  const localizedTranslate = getLocalizedTranslate(locale, sentence_locale, sentence_translate);

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
            {parseHtml(localizedTranslate)}
          </h4>
        </div>
        <div className="flex items-center">
          <div className="flex-1 min-w-0 mt-1">
            <div className={`${hideSpeaker ? 'hidden' : ''}`}>
              {speaker && <SpeechPlayer src={speaker} fallbackText={sentence || sentence_read} />}
            </div>
            <div className={`text-sm font-medium bg-blue-200 p-2 text-gray-900 ${hideKeyword ? 'hidden' : ''}`}>
              {keyword && parseHtml(`∎${keyword}`)}
              <p className="text-red-800 font-bold mt-2">{t("speak.tipKeyword")}</p>
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
