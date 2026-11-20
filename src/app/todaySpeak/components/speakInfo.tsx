"use client";
import VisibilityIcon from "@/app/components/Icons/VisibilityIcon";
import React, { memo } from "react";
import SpeechPlayer from "@/app/components/Audio/SpeechPlayer";
import CardImage from "@/app/components/Cards/CardImage";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/app/providers/I18nProvider";
import {
  getLocalizedTranslate,
  getLocalizedWord,
} from "@/app/utils/sentenceLocale";

type SpeakInfoProps = {
  speakInfo: any;
  onClick?: (data: any) => void;
};

const SpeakInfo = ({ speakInfo, onClick }: SpeakInfoProps) => {
  const { t, locale } = useTranslations();
  const {
    sortNo,
    keyword,
    sentence,
    sentence_read,
    word,
    word_locale,
    sentence_translate,
    sentence_locale,
    image,
    hideSentence = true,
    hideSentenceRead = true,
    hideKeyword = true,
    hideSentenceTranslate = true,
    hideWord = true,
    hideSpeaker = true,
    speaker,
  } = speakInfo;
  const localizedTranslate = getLocalizedTranslate(
    locale,
    sentence_locale,
    sentence_translate,
  );
  const localizedWord = getLocalizedWord(locale, word_locale, word);

  const handleClick = (colType: string) => {
    let visibleInfo = {};
    if (colType === "sentence") visibleInfo = { hideSentence: !hideSentence };
    else if (colType === "sentence_read")
      visibleInfo = { hideSentenceRead: !hideSentenceRead };
    else if (colType === "keyword") visibleInfo = { hideKeyword: !hideKeyword };
    else if (colType === "sentence_translate")
      visibleInfo = { hideSentenceTranslate: !hideSentenceTranslate };
    else if (colType === "word") visibleInfo = { hideWord: !hideWord };
    else if (colType === "speak") visibleInfo = { hideSpeaker: !hideSpeaker };
    onClick?.({ ...speakInfo, ...visibleInfo });
  };

  const parseHtml = (html: string, sentenceType?: string) => {
    if (!html) return <span>{"\u00A0"}</span>;

    let pHtml = html;
    pHtml = pHtml.replaceAll("\\r\\n", "<br />");
    pHtml = pHtml.replaceAll("\\n", "<br />");
    // Keep spaces inside HTML tags intact (e.g. <br />). Only nbsp text nodes.
    pHtml = pHtml.replace(/(<[^>]+>)|(\s)/g, (match, tag, space) => {
      if (tag) return tag;
      return space === "\n" || space === "\r" ? "<br />" : "&nbsp;";
    });

    if (sentenceType === "sentence") {
      pHtml = pHtml.replace(
        /\([^)]+\)/g,
        (str) => `<span class="text-red-600">${str}</span>`,
      );
      pHtml = pHtml.replace(
        /\uFF08[^\uFF09]+\uFF09/g,
        (str) => `<span class="text-red-600">${str}</span>`,
      );
    }

    return (
      <div
        className="app-today-html"
        dangerouslySetInnerHTML={{ __html: pHtml }}
      />
    );
  };

  const masked = "\u2022".repeat(12);

  const renderField = (
    label: string,
    content: React.ReactNode,
    hidden: boolean,
    colType: string,
  ) => (
    <div className="app-today-field">
      <span className="app-today-field-label">{label}</span>
      <div
        className={`app-today-field-value ${hidden ? "app-today-field-value--masked" : ""}`}
        aria-hidden={hidden}
      >
        {hidden ? masked : content}
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={() => handleClick(colType)}
        title={hidden ? t("today.show") : t("today.hide")}
        aria-label={hidden ? t("today.show") : t("today.hide")}
      >
        <VisibilityIcon hidden={hidden} />
      </Button>
    </div>
  );

  return (
    <article className="app-today-item">
      <div className="app-today-item-header">
        <div className="app-today-item-meta">
          {sortNo != null && (
            <span className="app-today-no">
              {t("today.number")} {sortNo}
            </span>
          )}
        </div>
        {speaker && (
          <Button
            type="button"
            variant={hideSpeaker ? "outline" : "secondary"}
            size="sm"
            onClick={() => handleClick("speak")}
            className="gap-1.5"
            aria-pressed={!hideSpeaker}
            title={hideSpeaker ? t("today.show") : t("today.hide")}
          >
            <VisibilityIcon hidden={!!hideSpeaker} />
            <span>{t("common.play")}</span>
          </Button>
        )}
      </div>

      {image && (
        <div className="mb-3">
          <CardImage image={{ link: image }} />
        </div>
      )}

      {speaker && !hideSpeaker && (
        <div className="app-today-speak-audio mb-3">
          <SpeechPlayer
            src={speaker}
            fallbackText={sentence || sentence_read}
          />
        </div>
      )}

      <div className="app-today-item-body">
        {renderField(
          t("common.sentence"),
          parseHtml(sentence, "sentence"),
          hideSentence,
          "sentence",
        )}
        {renderField(
          t("common.read"),
          parseHtml(sentence_read),
          hideSentenceRead,
          "sentence_read",
        )}
        {renderField(
          t("common.keyword"),
          parseHtml(keyword),
          hideKeyword,
          "keyword",
        )}
        {renderField(
          t("common.translation"),
          parseHtml(localizedTranslate),
          hideSentenceTranslate,
          "sentence_translate",
        )}
        {renderField(
          t("common.word"),
          parseHtml(localizedWord),
          hideWord,
          "word",
        )}
      </div>
    </article>
  );
};

export default memo(SpeakInfo);
