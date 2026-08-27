'use client'
import React, {memo} from 'react';
import { MouseEvent } from 'react';
import { useTranslations } from '@/app/providers/I18nProvider';

type ClassificationProps = {
  classData?: any,
  onClick?: (data: any) => any,
}

const Classification = (props: ClassificationProps) => {
  const { t, locale } = useTranslations();
  const { onClick } = props;
  const hideLocalizedName = locale === 'ja' || locale === 'en';

  const handleClick = (selectedData: any) => (e: MouseEvent<HTMLElement>) => {
    onClick && onClick(selectedData);
  }

  const items = [
    { key: 'vocabulary', label: t('levelUp.vocab'), kanji: '文字語彙', sub: 'VOCABULARY' },
    { key: 'grammar', label: t('levelUp.grammar'), kanji: '文法', sub: 'GRAMMAR' },
    { key: 'reading', label: t('levelUp.reading'), kanji: '読解', sub: 'READING' },
    { key: 'listening', label: t('levelUp.listening'), kanji: '聴解', sub: 'LISTENING' },
  ];

  return (
    <div className="grid grid-cols-4 gap-3 sm:grid-cols-1">
      {items.map((item) => (
        <button
          key={item.key}
          onClick={handleClick({ classification: item.key })}
          className="app-year-btn text-center leading-snug"
          type="button"
        >
          {hideLocalizedName ? item.kanji : `${item.label} ${item.kanji}`}
          <br />
          {item.sub}
        </button>
      ))}
    </div>
  );
}

export default memo(Classification)
