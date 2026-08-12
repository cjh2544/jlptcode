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
    { part: 'part2', label: 'PART2', sub: t('levelUp.qa') },
    { part: 'part3', label: 'PART3', sub: t('levelUp.conversation') },
    { part: 'part5', label: 'PART5', sub: t('levelUp.findAnswer') },
    { part: 'part7', label: 'PART7', sub: t('levelUp.fillBlank') },
    { part: 'part8', label: 'PART8', sub: t('levelUp.reading') },
  ];

  return (
    <div className="grid grid-cols-4 gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <button
          key={item.part}
          onClick={handleClick({ part: item.part })}
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
