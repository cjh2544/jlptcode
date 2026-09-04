"use client";

import { isEmpty } from "lodash";
import React, { memo } from "react";
import CardAudio from "./CardAudio";
import CardImage from "./CardImage";
import QuestionAssistButton from "@/app/components/Buttons/QuestionAssistButton";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "@/app/providers/I18nProvider";

type JlptContentProps = {
  questionType?: string;
  question?: any;
  sentence?: any;
  showReadButton?: boolean;
  showTransButton?: boolean;
};

const CardJlptContent = (props: JlptContentProps) => {
  const {
    question,
    sentence,
    showReadButton = true,
    showTransButton = true,
  } = props;
  const { content = "", audio = {}, image = {} } = question || {};
  const { t } = useTranslations();

  const [openTranslate, setOpenTranslate] = React.useState(false);
  const [openRead, setOpenRead] = React.useState(false);
  const hasRead = Boolean(showReadButton && sentence?.reading);
  const hasTrans = Boolean(showTransButton && sentence?.translation);
  const hasTools = hasRead || hasTrans;
  const toggleOpenTranslate = () => setOpenTranslate((cur) => !cur);
  const toggleOpenRead = () => setOpenRead((cur) => !cur);

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
    <>
      <div className="flex flex-col min-w-0 wrap-break-word rounded mb-1">
        {!isEmpty(content) && (
          <div className="flex-auto px-4 py-2">
            <div className="w-full">
              <div className="app-question-content flex-col gap-2">
                {parseHtml(content || "")}
                {hasTools && (
                  <div className="app-question-tools">
                    {hasRead && (
                      <QuestionAssistButton
                        kind="read"
                        active={openRead}
                        label={t("common.read")}
                        onClick={toggleOpenRead}
                      />
                    )}
                    {hasTrans && (
                      <QuestionAssistButton
                        kind="translation"
                        active={openTranslate}
                        label={t("common.translation")}
                        onClick={toggleOpenTranslate}
                      />
                    )}
                  </div>
                )}
                {openTranslate && (
                  <div className="app-reveal">
                    <Card className="w-full" size="sm">
                      <CardContent className="w-full px-4 py-3 font-nanumGothic">
                        {parseHtml(sentence?.translation || "")}
                      </CardContent>
                    </Card>
                  </div>
                )}
                {openRead && (
                  <div className="app-reveal">
                    <Card className="w-full" size="sm">
                      <CardContent className="w-full px-4 py-3 font-nanumGothic">
                        {parseHtml(sentence?.reading || "")}
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
};

export default memo(CardJlptContent);
