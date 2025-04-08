'use client';
import { useWordTodayStore } from '@/app/store/wordTodayStore';
import { Button, Card, Typography } from "@material-tailwind/react";
import { memo, Suspense, useEffect, useState } from 'react';
import HeaderButton from './headerButton';
import SpeakInfo from './speakInfo';

type SpeakListProps = {
  className?: string,
}

const SpeakList = ({className}: SpeakListProps) => {
  const wordTodayList = useWordTodayStore((state) => state.wordTodayList);
  const setWordTodayList = useWordTodayStore((state) => state.setWordTodayList);
  
  const handleClickVisible = (wordInfo: any, rowNum: number) => {
    setWordTodayList(
      wordTodayList.map((item, idx) => idx === rowNum ? {...item, ...wordInfo} : item)
    );
  }

  return (
    <div className={`mx-4 ${className}`} onContextMenu={(e) => e.preventDefault()} onMouseDown={(e) => e.preventDefault()}>
      <div className="w-full p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-8 dark:bg-gray-800 dark:border-gray-700">
        <div className="flow-root">
          <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
            {wordTodayList.map((item, index) => (
              <SpeakInfo key={index} wordInfo={item} onClick={(data: any) => handleClickVisible(data, index)} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default memo(SpeakList)