'use client';
import VisibilityIcon from "@/app/components/Icons/VisibilityIcon";
import React, { memo } from 'react';
import SpeechPlayer from '@/app/components/Audio/SpeechPlayer';
import { Button } from '@/components/ui/button';
import { useTranslations } from '@/app/providers/I18nProvider';

type SpeakInfoProps = {
  wordInfo: any;
  onClick?: (data: any) => void;
};

const SpeakInfo = ({ wordInfo, onClick }: SpeakInfoProps) => {
  const { t } = useTranslations();
  const {
    wordNo,
    study,
    keyword,
    sentence,
    sentence_read,
    sentence_translate,
    hideSentence = true,
    hideSentenceRead = true,
    hideKeyword = true,
    hideSpeaker = true,
    speaker,
  } = wordInfo;

  const handleClick = (colType: string) => {
    let visibleInfo = {};

    if (colType === 'sentence') {
      visibleInfo = { hideSentence: !hideSentence };
    } else if (colType === 'sentence_read') {
      visibleInfo = { hideSentenceRead: !hideSentenceRead };
    } else if (colType === 'keyword') {
      visibleInfo = { hideKeyword: !hideKeyword };
    } else if (colType === 'speak') {
      visibleInfo = { hideSpeaker: !hideSpeaker };
    }

    onClick?.({ ...wordInfo, ...visibleInfo });
  };

  const parseHtml = (html: string, sentenceType?: string) => {
    if (!html) return <span>{'\u00A0'}</span>;

    let pHtml = html;
    pHtml = pHtml.replaceAll(/\s/g, '&nbsp;');
    pHtml = pHtml.replaceAll('\\r\\n', '<br>');
    pHtml = pHtml.replaceAll('\\n', '<br>');

    if (sentenceType === 'sentence') {
      pHtml = pHtml.replace(/\([^)]+\)/g, (str) => `<span class="text-red-600">${str}</span>`);
      pHtml = pHtml.replace(/\uFF08[^\uFF09]+\uFF09/g, (str) => `<span class="text-red-600">${str}</span>`);
    }

    return <div dangerouslySetInnerHTML={{ __html: pHtml }} />;
  };

  const masked = '\u2022'.repeat(12);

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
        {hidden ? masked : content}
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
          {wordNo != null && wordNo !== '' && (
            <span className="app-today-no">
              {t('today.number')} {wordNo}
            </span>
          )}
        </div>
        {speaker && (
          <Button
            type="button"
            variant={hideSpeaker ? 'outline' : 'secondary'}
            size="sm"
            onClick={() => handleClick('speak')}
            className="gap-1.5"
            aria-pressed={!hideSpeaker}
            title={hideSpeaker ? t('today.show') : t('today.hide')}
          >
            <VisibilityIcon hidden={!!hideSpeaker} />
            <span>{t('common.play')}</span>
          </Button>
        )}
      </div>

      <div className="app-today-speak-prompt">
        <span className="app-today-field-label">{t('common.translation')}</span>
        <div className="app-today-speak-prompt-text">{parseHtml(sentence_translate)}</div>
        {speaker && !hideSpeaker && (
          <div className="app-today-speak-audio">
            <SpeechPlayer src={speaker} />
          </div>
        )}
      </div>

      <div className="app-today-item-body">
        {renderField(
          t('common.keyword'),
          <>
            {keyword && parseHtml(`\u220E${keyword}`)}
            <p className="app-today-speak-tip">{t('speak.tipKeyword')}</p>
          </>,
          hideKeyword,
          'keyword',
        )}
        {renderField(t('common.sentence'), parseHtml(sentence, 'sentence'), hideSentence, 'sentence')}
        {renderField(t('common.read'), parseHtml(sentence_read), hideSentenceRead, 'sentence_read')}
      </div>
    </article>
  );
};

export default memo(SpeakInfo);
