"use client";

import React, {memo} from "react";
import CardAudio from "./CardAudio";
import CardImage from "./CardImage";
import { isEmpty } from "lodash";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/app/providers/I18nProvider";
import { getLocalizedTranslate } from "@/app/utils/sentenceLocale";
import { formatQuestionHtml, questionImageLink, splitLeadingImages } from "@/app/lib/question-html";

type LevelUpQuestionProps = {
  classification?: string;
  questionType?: string,
  question: any,
  id?: string
  questionNo?: number,
  sentence?: any,
  showReadButton?: boolean,
  showTransButton?: boolean,
  showSpeakButton?: boolean,
  speaker?: string,
  sentence_locale?: {
    en?: string;
    cn?: string;
    my?: string;
  },
}

const CardLevelUpQuestion = (props:LevelUpQuestionProps) => {
  const {classification, questionType, question, id = '', questionNo, sentence = {}, showReadButton = true, showTransButton = true, showSpeakButton = true, speaker, sentence_locale} = props;
  const {content = '', audio = {}, image = {}, translate, read} = question || {};
  const { t, locale } = useTranslations();
  const reading = sentence?.reading || read;
  const translation = getLocalizedTranslate(locale, sentence_locale, sentence?.translation || translate);
  const isListening = classification === 'listening';
  const hasReading = Boolean(String(reading ?? '').trim());
  const playbackSrc = speaker || audio?.link;
  const hasPlayback = Boolean(playbackSrc);
  const hasSpeak = Boolean(showSpeakButton && hasPlayback && !isListening);
  const [openTranslate, setOpenTranslate] = React.useState(false);
  const [openRead, setOpenRead] = React.useState(false);
  const [openSpeaker, setOpenSpeaker] = React.useState(false);
  const toggleOpenTranslate = () => setOpenTranslate((cur) => !cur);
  const toggleOpenRead = () => setOpenRead((cur) => !cur);
  const toggleOpenSpeaker = () => setOpenSpeaker((cur) => !cur);
  const { imagesHtml, restHtml, imageCount } = splitLeadingImages(content || "");
  const hasCardImage = Boolean(questionImageLink(question));
  const hoistImages = imageCount >= 2 || (imageCount >= 1 && hasCardImage);
  
  const parseHtml = (html: string) => {
    return html ? <div dangerouslySetInnerHTML={{ __html: formatQuestionHtml(html) }} /> : <></>;
  };

  const parseRawHtml = (html: string) => {
    return html ? <div dangerouslySetInnerHTML={{ __html: formatQuestionHtml(html, false) }} /> : <></>;
  };

  const passageHtml = hoistImages ? restHtml : content;

  return (
    <>
      <div className="flex flex-col min-w-0 wrap-break-word rounded mb-1">
        {hoistImages && (
          <div className="flex-auto p-2">
            {imagesHtml ? parseRawHtml(imagesHtml) : null}
            {hasCardImage && <CardImage image={image} />}
          </div>
        )}
        <div className={`flex-auto py-2 ${questionType === 'group' ? 'app-question-group' : 'app-question-normal'}`}>
          <div className="app-question-passage flex flex-wrap" id={id}>
            <div className="mr-1">{`${questionNo ? questionNo + '.' : ''}`}</div>
            <div>{parseHtml(passageHtml || '')}</div>
          </div>
          <div className="app-question-tools">
            {showReadButton && hasReading && (
              <Button onClick={toggleOpenRead} className="px-2 py-1">
                {isListening ? t('common.sentence') : t('common.read')}
              </Button>
            )}
            {showTransButton && translation && (
              <Button onClick={toggleOpenTranslate} className="px-2 py-1">
                {t('common.translation')}
              </Button>
            )}
            {hasSpeak && (
              <Button onClick={toggleOpenSpeaker} className="px-2 py-1">
                {t('common.pronunciation')}
              </Button>
            )}
          </div>
          {isListening && hasPlayback && (
            <div className="app-reveal-panel p-3">
              <CardAudio audio={audio} speaker={speaker} />
            </div>
          )}
          {openRead && (
            <div className="app-reveal">
              <div className="app-reveal-panel">
                {parseHtml(reading || '')}
              </div>
            </div>
          )}
          {openTranslate && (
            <div className="app-reveal">
              <div className="app-reveal-panel">
                {parseHtml(translation || '')}
              </div>
            </div>
          )}
          {hasSpeak && openSpeaker && (
            <div className="app-reveal">
              <div className="app-reveal-panel p-3">
                <CardAudio audio={audio} speaker={speaker} />
              </div>
            </div>
          )}
        </div>
        {!isListening && !isEmpty(audio) && (
          <div className="flex-auto py-2">
            <CardAudio audio={audio} speaker={speaker} />
          </div>
        )}
        {!hoistImages && !isEmpty(image) && (
          <div className="flex-auto p-2">
            <CardImage image={image} />
          </div>
        )}
      </div>
    </>
  );
}

export default memo(CardLevelUpQuestion);
