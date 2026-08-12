'use client'
import React, {memo} from 'react';
import { MouseEvent } from 'react';
import { useTranslations } from '@/app/providers/I18nProvider';

type ClassificationProps = {
  classData?: any,
  onClick?: (data: any) => any,
}

const Classification = (props: ClassificationProps) => {
  const { t } = useTranslations();
  const { onClick } = props;

  const handleClick = (selectedData: any) => (e: MouseEvent<HTMLElement>) => {
    onClick && onClick(selectedData);
  }

  const items = [
    { key: 'vocabulary', label: `${t('levelUp.vocab')} 文字語彙`, sub: 'VOCABULARY' },
    { key: 'grammar', label: `${t('levelUp.grammar')} 文法`, sub: 'GRAMMAR' },
    { key: 'listening', label: `${t('levelUp.listening')} 聴解`, sub: 'Listening' },
    { key: 'reading', label: `${t('levelUp.reading')} 読解`, sub: 'Reading' },
  ];

  return (
    <div className="grid grid-cols-4 gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <button
          key={item.key}
          onClick={handleClick({ classification: item.key })}
          className="app-year-btn text-center leading-snug"
          type="button"
        >
          {item.label}
          <br />
          {item.sub}
        </button>
      ))}
    </div>
  );
}

export default memo(Classification)
