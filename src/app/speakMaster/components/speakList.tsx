'use client';
import { useSpeakTodayStore } from '@/app/store/speakTodayStore';
import { Button, Card, Typography } from "@material-tailwind/react";
import { memo, Suspense, useEffect, useState } from 'react';
import HeaderButton from './headerButton';
import SpeakInfo from './speakInfo';
import { isEmpty } from 'lodash';
import { useTranslations } from '@/app/providers/I18nProvider';

type SpeakListProps = {
  className?: string,
}

const SpeakList = ({className}: SpeakListProps) => {
  const { t } = useTranslations();
  const wordTodayList = useSpeakTodayStore((state:any) => state.wordTodayList);
  const setWordTodayList = useSpeakTodayStore((state:any) => state.setSpeakTodayList);
  
  const handleClickVisible = (wordInfo: any, rowNum: number) => {
    setWordTodayList(
      wordTodayList.map((item: any, idx: number) => idx === rowNum ? {...item, ...wordInfo} : item)
    );
  }

  return (
    <div className={`mx-4 ${className}`} onContextMenu={(e) => e.preventDefault()} onMouseDown={(e) => e.preventDefault()}>
      <div className="w-full p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-8 dark:bg-gray-800 dark:border-gray-700">
        <div className="flow-root">
          {isEmpty(wordTodayList) ? (
            <div className='py-3 sm:py-4 text-center'>{t('common.noData')}</div>
          ) : (
            <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
              {wordTodayList.map((item: any, index: number) => (
                <SpeakInfo key={index} wordInfo={item} onClick={(data: any) => handleClickVisible(data, index)} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default memo(SpeakList)