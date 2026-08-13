'use client';
import VisibilityIcon from "@/app/components/Icons/VisibilityIcon";
import React, {memo} from "react";
import CardWordQuestion from "@/app/components/Cards/CardWordQuestion";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/app/providers/I18nProvider";

type WordInfoProps = {
  wordInfo: any
  onClick?: any
}

const WordInfo = (props:WordInfoProps) => {
  const { t } = useTranslations();
  const {
    wordInfo,
    onClick
  } = props;
  const {
    level,
    study,
    wordNo,
    word,
    read,
    means,
    sentence_read,
    sentence_translate,
    speaker,
    question,
    showQuestion = false,
    hideWord = false,
    hideRead = false,
    hideMeans = false
  } = wordInfo;

  const handleClick = (colType: string) => {
    let visibleInfo = {};

    if('word' === colType) {
      visibleInfo = { hideWord: !hideWord };
    } else if('read' === colType) {
      visibleInfo = { hideRead: !hideRead };
    } else if('means' === colType) {
      visibleInfo = { hideMeans: !hideMeans };
    }

    onClick && onClick({...wordInfo, ...visibleInfo});
  }

  const handleShowQuestion = () => {
    onClick && onClick({...wordInfo, showQuestion: !wordInfo.showQuestion });
  }

  const renderField = (
    label: string,
    value: string,
    hidden: boolean,
    colType: string,
    valueClassName?: string,
  ) => (
    <div className="app-today-field">
      <span className="app-today-field-label">{label}</span>
      <div
        className={`app-today-field-value ${valueClassName ?? ''} ${hidden ? 'app-today-field-value--masked' : ''}`}
        aria-hidden={hidden}
      >
        {hidden ? '\u2022\u2022\u2022\u2022\u2022\u2022' : (value || '\u00A0')}
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
        {level !== 'N0' && (
          <Button
            type="button"
            variant={showQuestion ? 'secondary' : 'outline'}
            size="sm"
            onClick={handleShowQuestion}
          >
            {showQuestion ? t('today.closeQuestion') : t('today.checkQuestion')}
          </Button>
        )}
      </div>
      <div className="app-today-item-body">
        {renderField(t('word.word'), word, hideWord, 'word', 'app-today-field-value--word')}
        {renderField(t('word.reading'), read, hideRead, 'read')}
        {renderField(t('word.meaning'), means, hideMeans, 'means')}
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

export default memo(WordInfo);
