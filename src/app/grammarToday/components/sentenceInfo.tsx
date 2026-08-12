'use client';
import React, {memo} from "react";
import CardWordQuestion from "@/app/components/Cards/CardWordQuestion";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/app/providers/I18nProvider";

type SentenceInfoProps = {
  sentenceInfo: any
  onClick?: any
}

const SentenceInfo = (props:SentenceInfoProps) => {
  const { t } = useTranslations();
  const {
    sentenceInfo,
    onClick
  } = props;
  const {
    study,
    sortNo,
    sentence,
    sentence_read,
    sentence_translate,
    question,
    answer,
    showQuestion = false,
    hideSentence = false,
    hideSentenceRead = false,
    hideSentenceTranslate = false
  } = sentenceInfo;

  const handleClick = (colType: string) => {
    let visibleInfo = {};

    if('sentence' === colType) {
      visibleInfo = { hideSentence: !hideSentence };
    } else if('sentence_read' === colType) {
      visibleInfo = { hideSentenceRead: !hideSentenceRead };
    } else if('sentence_translate' === colType) {
      visibleInfo = { hideSentenceTranslate: !hideSentenceTranslate };
    }

    onClick && onClick({...sentenceInfo, ...visibleInfo});
  }

  const handleShowQuestion = () => {
    onClick && onClick({...sentenceInfo, showQuestion: !sentenceInfo.showQuestion });
  }

  const parseHtml = (html: string, sentenceType?: string) => {
    if (!html) return <span>{'\u00A0'}</span>;

    let pHtml = html;

    pHtml = pHtml.replaceAll(/\s/g, "&nbsp;");
    pHtml = pHtml.replaceAll('\\r\\n', '<br>');
    pHtml = pHtml.replaceAll('\\n', '<br>');

    if(sentenceType === 'sentence') {
      pHtml = pHtml.replace(/\([^)]+\)/g, (str) => '<span class="text-red-600">' + str + '</span>');
      pHtml = pHtml.replace(/\（[^)]+\）/g, (str) => '<span class="text-red-600">' + str + '</span>');
    }

    return <div dangerouslySetInnerHTML={{ __html: pHtml }} />;
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
        {hidden ? '••••••••••••' : content}
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={() => handleClick(colType)}
        title={hidden ? t('today.show') : t('today.hide')}
        aria-label={hidden ? t('today.show') : t('today.hide')}
      >
        <i className={hidden ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash'} aria-hidden />
      </Button>
    </div>
  );

  return (
    <article className="app-today-item">
      <div className="app-today-item-header">
        <div className="app-today-item-meta">
          {study && <span className="app-today-badge">{study}</span>}
          <span className="app-today-no">
            {t('today.number')} {sortNo}
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
        {renderField(t('common.sentence'), parseHtml(sentence, 'sentence'), hideSentence, 'sentence')}
        {renderField(t('common.read'), parseHtml(sentence_read), hideSentenceRead, 'sentence_read')}
        {renderField(t('common.translation'), parseHtml(sentence_translate), hideSentenceTranslate, 'sentence_translate')}
      </div>
      {showQuestion && (
        <div className="app-today-item-question app-reveal">
          <CardWordQuestion questionInfo={{...question, answer}} />
        </div>
      )}
    </article>
  );
}

export default memo(SentenceInfo);
