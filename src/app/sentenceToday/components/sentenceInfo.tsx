'use client';
import VisibilityIcon from "@/app/components/Icons/VisibilityIcon";
import React, {memo} from "react";
import CardWordQuestion from "@/app/components/Cards/CardWordQuestion";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/app/providers/I18nProvider";

type SentenceInfoProps = {
  wordInfo: any
  onClick?: any
}

const SentenceInfo = (props:SentenceInfoProps) => {
  const { t } = useTranslations();
  const {
    wordInfo,
    onClick
  } = props;
  const {
    study,
    wordNo,
    sentence,
    sentence_read,
    sentence_translate,
    speaker,
    question,
    showQuestion = false,
    hideSentence = false,
    hideSentenceRead = false,
    hideSentenceTranslate = false
  } = wordInfo;

  const handleClick = (colType: string) => {
    let visibleInfo = {};

    if('sentence' === colType) {
      visibleInfo = { hideSentence: !hideSentence };
    } else if('sentence_read' === colType) {
      visibleInfo = { hideSentenceRead: !hideSentenceRead };
    } else if('sentence_translate' === colType) {
      visibleInfo = { hideSentenceTranslate: !hideSentenceTranslate };
    }

    onClick && onClick({...wordInfo, ...visibleInfo});
  }

  const handleShowQuestion = () => {
    onClick && onClick({...wordInfo, showQuestion: !wordInfo.showQuestion });
  }

  const parseHtml = (html: string) => {
    if(html) {
      return <div dangerouslySetInnerHTML={{ __html: html.replaceAll('\\r\\n', '<br>').replaceAll('\\n', '<br>').replaceAll(/\s/g, "&nbsp;") }} />;
    }
    return <span>{'\u00A0'}</span>;
  };

  const renderField = (
    label: string,
    content: React.ReactNode,
    hidden: boolean,
    colType: string,
  ) => (
    <div className="app-today-field">
      <span className="app-today-field-label">{label}</span>
      <div
        className={`app-today-field-value ${hidden ? 'app-today-field-value--masked' : ''}`}
        aria-hidden={hidden}
      >
        {hidden ? '\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022' : content}
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={() => handleClick(colType)}
        title={hidden ? t('today.show') : t('today.hide')}
        aria-label={hidden ? t('today.show') : t('today.hide')}
      >
        <VisibilityIcon hidden={hidden} />
      </Button>
    </div>
  );

  return (
    <article className="app-today-item">
      <div className="app-today-item-header">
        <div className="app-today-item-meta">
          {study && <span className="app-today-badge">{study}</span>}
          <span className="app-today-no">
            {t('today.number')} {wordNo}
          </span>
        </div>
        <Button
          type="button"
          variant={showQuestion ? 'secondary' : 'outline'}
          size="sm"
          onClick={handleShowQuestion}
        >
          {showQuestion ? t('today.closeQuestion') : t('today.checkQuestion')}
        </Button>
      </div>
      <div className="app-today-item-body">
        {renderField(t('common.sentence'), parseHtml(sentence), hideSentence, 'sentence')}
        {renderField(t('common.read'), parseHtml(sentence_read), hideSentenceRead, 'sentence_read')}
        {renderField(t('common.translation'), parseHtml(sentence_translate), hideSentenceTranslate, 'sentence_translate')}
      </div>
      {showQuestion && (
        <div className="app-today-item-question app-reveal">
          <CardWordQuestion
            questionInfo={question}
            speaker={speaker}
            sentence_read={sentence_read}
            sentence_translate={sentence_translate}
          />
        </div>
      )}
    </article>
  );
}

export default memo(SentenceInfo);
