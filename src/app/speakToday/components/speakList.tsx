'use client';
import { useWordTodayNewStore } from '@/app/store/wordTodayNewStore';
import { Button, Card, Typography } from "@material-tailwind/react";
import WordInfo from './wordInfo';
import { memo, Suspense, useEffect, useState } from 'react';
import HeaderButton from './headerButton';
import SpeakInfo from './speakInfo';

type SpeakListProps = {
  className?: string,
}

const SpeakList = ({className}: SpeakListProps) => {
  const wordTodayList = useWordTodayNewStore((state) => state.wordTodayList);
  const setWordTodayList = useWordTodayNewStore((state) => state.setWordTodayList);
  
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

      {/* <Card className="h-full w-full overflow-scroll">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head: any, idx) => (
                <th key={idx} className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                  <div className="text-sm font-normal flex justify-between items-center">
                    <label>{head?.label}</label>
                    {head.visibleBtn && (
                      <HeaderButton colName={head.code} />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {wordTodayList.map((item, index) => (
              <WordInfo key={index} wordInfo={item} onClick={(data: any) => handleClickVisible(data, index)} />
            ))}
          </tbody>
        </table>
      </Card> */}
    </div>
  )
}

export default memo(SpeakList)