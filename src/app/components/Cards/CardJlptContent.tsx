"use client";

import { isEmpty } from "lodash";
import React, {memo} from "react";
import CardAudio from "./CardAudio";
import CardImage from "./CardImage";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "@/app/providers/I18nProvider";

type JlptContentProps = {
  questionType?: string,
  question?: any,
  sentence?: any,
  showReadButton?: boolean,
  showTransButton?: boolean,
}

const CardJlptContent = (props:JlptContentProps) => {
  const {questionType, question, sentence = {}, showReadButton = true, showTransButton = true} = props;
  const {content = '', audio = {}, image = {}} = question;
  const {translation, reading} = sentence;
  const { t } = useTranslations();

  const [openTranslate, setOpenTranslate] = React.useState(false);
  const [openRead, setOpenRead] = React.useState(false);
  const toggleOpenTranslate = () => setOpenTranslate((cur) => !cur);
  const toggleOpenRead = () => setOpenRead((cur) => !cur);

  const parseHtml = (html: string) => {
    return html ? <div dangerouslySetInnerHTML={{ __html: html.toString().replaceAll('\\r\\n', '<br>').replaceAll('\\n', '<br>').replaceAll(/\s/g, "&nbsp;") }} /> : <></>;
  };

  return (
    <>
      <div className="flex flex-col min-w-0 wrap-break-word rounded mb-1">
        {!isEmpty(content) && (<div className="flex-auto px-4 py-2">
          <div className="w-full">
            <div className="app-question-content flex-col">
              {parseHtml(content || '')}
              {showReadButton && sentence?.reading && (
                <span><Button onClick={toggleOpenRead} className="px-2 py-1 ml-1">{t('common.read')}</Button></span>
              )}
              {showTransButton && sentence?.translation && (
                <span><Button onClick={toggleOpenTranslate} className="px-2 py-1 ml-1">{t('common.translation')}</Button></span>
              )}
              {openTranslate && (
                <div className="app-reveal">
                  <Card className="w-full" size="sm">
                    <CardContent className="w-full px-4 py-3 font-nanumGothic">
                      {parseHtml(sentence?.translation || '')}
                    </CardContent>
                  </Card>
                </div>
              )}
              {openRead && (
                <div className="app-reveal">
                  <Card className="w-full" size="sm">
                    <CardContent className="w-full px-4 py-3 font-nanumGothic">
                      {parseHtml(sentence?.reading || '')}
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
        )}
        {!isEmpty(audio) && (
          <div className="flex-auto p-2">
            <CardAudio audio={audio} />
          </div>
        )}
        {!isEmpty(image) && (
          <div className="flex-auto p-2">
            <CardImage image={image} />
          </div>
        )}
      </div>
    </>
  );
}

export default memo(CardJlptContent);
