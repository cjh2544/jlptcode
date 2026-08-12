"use client";

import { isEmpty } from "lodash";
import React, {memo} from "react";
import CardAudio from "./CardAudio";
import CardImage from "./CardImage";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "@/app/providers/I18nProvider";

type JlptQuestionProps = {
  classification?: string,
  questionType?: string,
  question: any,
  id?: string,
  sentence?: any,
  showReadButton?: boolean,
  showTransButton?: boolean,
  speaker?: string,
}

const CardJlptQuestion = (props:JlptQuestionProps) => {
  const {classification, questionType, question, id = '', sentence, showReadButton = true, showTransButton = true, speaker} = props;
  const {content = '', audio = {}, image = {}} = question;
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
        {!isEmpty(content) && (
          <div className={`flex-auto px-4 py-2 ${questionType === 'group' ? 'app-question-group' : 'app-question-normal'}`}>
            <div className="flex flex-wrap" id={id}>
              {parseHtml(content || '')}
              {showReadButton && sentence?.reading && (
                <span>
                  <Button onClick={toggleOpenRead} className="px-2 py-1 ml-1">
                    {classification === 'listening' ? t('common.sentence') : t('common.read')}
                  </Button>
                </span>
              )}
              {showTransButton && sentence?.translation && (
                <span><Button onClick={toggleOpenTranslate} className="px-2 py-1 ml-1">{t('common.translation')}</Button></span>
              )}
            </div>
            {openRead && (
              <div className="app-reveal">
                <Card className="w-full" size="sm">
                  <CardContent className="w-full px-4 py-3">
                    {parseHtml(sentence?.reading || '')}
                  </CardContent>
                </Card>
              </div>
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
          </div>
        )}
        {(speaker || !isEmpty(audio)) && (
          <div className="flex-auto py-2 px-4">
            <CardAudio audio={audio} speaker={speaker} />
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

export default memo(CardJlptQuestion);
