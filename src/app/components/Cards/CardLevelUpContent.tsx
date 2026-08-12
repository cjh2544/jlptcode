"use client";

import { isEmpty } from "lodash";
import React, { memo } from "react";
import CardAudio from "./CardAudio";
import SpeechPlayer from "@/app/components/Audio/SpeechPlayer";
import CardImage from "./CardImage";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/app/providers/I18nProvider";

type LevelUpContentProps = {
  classification?: string;
  questionType?: string;
  question?: any;
  sentence?: any;
  showReadButton?: boolean;
  showTransButton?: boolean;
  showSpeakButton?: boolean;
  speaker?: string;
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
  } = props;
  const { content = "", audio = {}, image = {} } = question;
  const { translation, reading } = sentence;
  const isListening = classification === "listening";
  const { t } = useTranslations();

  const [openTranslate, setOpenTranslate] = React.useState(false);
  const [openRead, setOpenRead] = React.useState(false);
  const [openSpeaker, setOpenSpeaker] = React.useState(false);
  const toggleOpenTranslate = () => setOpenTranslate((cur) => !cur);
  const toggleOpenRead = () => setOpenRead((cur) => !cur);
  const toggleOpenSpeaker = () => setOpenSpeaker((cur) => !cur);

  const parseHtml = (html: string) => {
    return html ? (
      <div
        dangerouslySetInnerHTML={{
          __html: html
            .toString()
            .replaceAll("\\r\\n", "<br>")
            .replaceAll("\\n", "<br>")
            .replaceAll(/\s/g, "&nbsp;"),
        }}
      />
    ) : (
      <></>
    );
  };

  return (
    <div className="flex flex-col min-w-0 wrap-break-word rounded mb-1">
      {!isEmpty(content) && (
        <div className="flex-auto py-2 app-question-content">
          <div className="app-question-passage">
            {parseHtml(content || "")}
          </div>
          <div className="app-question-tools">
            {showReadButton && reading && (
              <Button onClick={toggleOpenRead} className="px-2 py-1">
                {isListening ? t("common.sentence") : t("common.read")}
              </Button>
            )}
            {showTransButton && translation && (
              <Button onClick={toggleOpenTranslate} className="px-2 py-1">
                {t("common.translation")}
              </Button>
            )}
            {showSpeakButton && speaker && !isListening && (
              <Button onClick={toggleOpenSpeaker} className="px-2 py-1">
                {t("common.pronunciation")}
              </Button>
            )}
          </div>
          {isListening && (speaker || !isEmpty(audio)) && (
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
          {openSpeaker && (
            <div className="app-reveal">
              <div className="app-reveal-panel p-3">
                {speaker && <SpeechPlayer src={speaker} />}
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
      {!isEmpty(image) && (
        <div className="flex-auto p-2">
          <CardImage image={image} />
        </div>
      )}
    </div>
  );
};

export default memo(CardLevelUpContent);
