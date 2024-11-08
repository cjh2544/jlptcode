'use client';
import { useWordTodayStore } from '@/app/store/wordTodayStore';
import { Button, Card, Typography } from "@material-tailwind/react";
import WordInfo from './sentenceInfo';
import { Suspense, useState } from 'react';
import HeaderButton from './headerButton';
import SentenceInfo from './sentenceInfo';

type SentenceListProps = {
  className?: string,
}

const TABLE_HEAD = [
  { label: "出題年度", visibleBtn: false },
  { label: "番号", visibleBtn: false },
  { label: "文章", visibleBtn: false },
  { label: "文章読み方", visibleBtn: false },
  { label: "文章意味", visibleBtn: false },
  { label: "出題問題", visibleBtn: false },
];

const SentenceList = ({className}: SentenceListProps) => {
  const wordTodayList = useWordTodayStore((state) => state.wordTodayList);
  const setWordTodayList = useWordTodayStore((state) => state.setWordTodayList);
  
  const handleClickVisible = (wordInfo: any, rowNum: number) => {
    setWordTodayList(
      wordTodayList.map((item, idx) => idx === rowNum ? {...item, ...wordInfo} : item)
    );
  }

  return (
    <div className={`mx-4 ${className}`}>
      <Card className="h-full w-full overflow-scroll">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head: any, idx) => (
                <th key={idx} className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                  <div className="text-sm font-normal flex justify-between items-center">
                    <label>{head?.label}</label>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {wordTodayList.map((item, index) => (
              <SentenceInfo key={index} wordInfo={item} onClick={(data: any) => handleClickVisible(data, index)} />
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}

export default SentenceList