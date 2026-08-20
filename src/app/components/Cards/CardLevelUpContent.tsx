"use client";

import { isEmpty } from "lodash";
import React, { memo } from "react";
import CardAudio from "./CardAudio";
import CardImage from "./CardImage";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/app/providers/I18nProvider";
import { getLocalizedTranslate } from "@/app/utils/sentenceLocale";
import { formatQuestionHtml, questionImageLink, splitLeadingImages } from "@/app/lib/question-html";

type LevelUpContentProps = {
  classification?: string;
  questionType?: string;
  question?: any;
  sentence?: any;
  showReadButton?: boolean;
  showTransButton?: boolean;
  showSpeakButton?: boolean;
  speaker?: string;
  sentence_locale?: {
    en?: string;
    cn?: string;
    my?: string;
  };
};

const CardLevelUpContent = (props: LevelUpContentProps) => {
  const {
    classification,
    question,
    sentence = {},
    showReadButton = true,
    showTransButton = true,
    showSpeakButton = true,
    speaker,
    sentence_locale,
  } = props;
  const { content = "", audio = {}, image = {}, translate, read } = question || {};
  const { t, locale } = useTranslations();
  const reading = sentence?.reading || read;
  const translation = getLocalizedTranslate(
    locale,
    sentence_locale,
    sentence?.translation || translate,
  );
  const isListening = classification === "listening";
  const { imagesHtml, restHtml, imageCount } = splitLeadingImages(content || "");
  const hasCardImage = Boolean(questionImageLink(question));
  const hoistImages = imageCount >= 2 || hasCardImage;
  const passageHtml = hoistImages && imageCount >= 2 ? restHtml : content;
  const hasPassage = Boolean(String(passageHtml ?? "").trim());
  const hasReading = Boolean(String(reading ?? "").trim());
  const playbackSrc = speaker || audio?.link;
  const hasPlayback = Boolean(playbackSrc);
  const hasRead = Boolean(showReadButton && hasReading);
  const hasTrans = Boolean(showTransButton && translation);
  const hasSpeak = Boolean(showSpeakButton && hasPlayback && !isListening);
  const hasTools = hasRead || hasTrans || hasSpeak;

  const [openTranslate, setOpenTranslate] = React.useState(false);
  const [openRead, setOpenRead] = React.useState(false);
  const [openSpeaker, setOpenSpeaker] = React.useState(false);
  const toggleOpenTranslate = () => setOpenTranslate((cur) => !cur);
  const toggleOpenRead = () => setOpenRead((cur) => !cur);
  const toggleOpenSpeaker = () => setOpenSpeaker((cur) => !cur);

  const parseHtml = (html: string) => {
    return html ? (
      <div dangerouslySetInnerHTML={{ __html: formatQuestionHtml(html) }} />
    ) : (
      <></>
    );
  };

  const parseRawHtml = (html: string) => {
    return html ? (
      <div dangerouslySetInnerHTML={{ __html: formatQuestionHtml(html, false) }} />
    ) : (
      <></>
    );
  };

  return (
    <div className="flex flex-col min-w-0 wrap-break-word rounded mb-1">
      {hoistImages && (
        <div className="flex-auto p-2">
          {imageCount >= 2 && imagesHtml ? parseRawHtml(imagesHtml) : null}
          {hasCardImage && <CardImage image={image} />}
        </div>
      )}
      {(hasPassage || hasTools || (isListening && hasPlayback)) && (
        <div className="flex-auto py-2 app-question-content">
          {hasPassage && (
            <div className="app-question-passage">
              {parseHtml(passageHtml || "")}
            </div>
          )}
          {hasTools && (
            <div className="app-question-tools">
              {hasRead && (
                <Button onClick={toggleOpenRead} className="px-2 py-1">
                  {isListening ? t("common.sentence") : t("common.read")}
                </Button>
              )}
              {hasTrans && (
                <Button onClick={toggleOpenTranslate} className="px-2 py-1">
                  {t("common.translation")}
                </Button>
              )}
              {hasSpeak && (
                <Button onClick={toggleOpenSpeaker} className="px-2 py-1">
                  {t("common.pronunciation")}
                </Button>
              )}
            </div>
          )}
          {isListening && hasPlayback && (
            <div className="app-reveal-panel p-3">
              <CardAudio audio={audio} speaker={speaker} />
            </div>
          )}
          {openTranslate && (
            <div className="app-reveal">
              <div className="app-reveal-panel">
                {parseHtml(translation || "")}
              </div>
            </div>
          )}
          {openRead && (
            <div className="app-reveal">
              <div className="app-reveal-panel">
                {parseHtml(reading || "")}
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
      )}
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
  );
};

export default memo(CardLevelUpContent);
