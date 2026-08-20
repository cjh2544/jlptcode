'use client';
import VisibilityIcon from "@/app/components/Icons/VisibilityIcon";
import React, {memo} from "react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/app/providers/I18nProvider";
import { SaveWordButton } from "@/app/components/Buttons/SaveButtons";

type WordInfoProps = {
  wordInfo: any
  index?: number
  displayNo?: number
  onClick?: any
}

const WordInfo = (props:WordInfoProps) => {
  const { t } = useTranslations();
  const {
    wordInfo,
    index,
    displayNo,
    onClick
  } = props;
  const {
    level,
    word,
    read,
    means,
    parts,
    hideWord = false,
    hideRead = false,
    hideMeans = false
  } = wordInfo;
  const no = displayNo ?? (typeof index === 'number' ? index + 1 : undefined);

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

  const partsLabel = Array.isArray(parts) ? parts.filter(Boolean).join(', ') : parts;

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
          {level && <span className="app-today-badge">{level}</span>}
          {partsLabel && <span className="app-today-badge">{partsLabel}</span>}
          {typeof no === 'number' && (
            <span className="app-today-no">
              {t('today.number')} {no}
            </span>
          )}
        </div>
        <SaveWordButton item={wordInfo} source="word" />
      </div>
      <div className="app-today-item-body">
        {renderField(t('word.word'), word, hideWord, 'word', 'app-today-field-value--word')}
        {renderField(t('word.reading'), read, hideRead, 'read')}
        {renderField(t('word.meaning'), means, hideMeans, 'means')}
      </div>
    </article>
  );
}

export default memo(WordInfo);
