'use client';
import { useWordTodayStore } from '@/app/store/wordTodayStore';
import { Button, Card, Typography } from "@material-tailwind/react";
import WordInfo from './wordInfo';
import { Suspense, useEffect, useState } from 'react';
import HeaderButton from './headerButton';

type WordListProps = {
  className?: string,
}

const TABLE_HEAD = [
  { label: "STUDY", visibleBtn: false },
  { label: "番号", visibleBtn: false },
  { label: "単語", visibleBtn: true, code: 'word' },
  { label: "読み方", visibleBtn: true, code: 'read' },
  { label: "意味", visibleBtn: true, code: 'means' },
  { label: "問題", visibleBtn: false },
];

const WordList = ({className}: WordListProps) => {
  const wordTodayList = useWordTodayStore((state:any) => state.wordTodayList);
  const setWordTodayList = useWordTodayStore((state:any) => state.setWordTodayList);
  
  const handleClickVisible = (wordInfo: any, rowNum: number) => {
    setWordTodayList(
      wordTodayList.map((item, idx) => idx === rowNum ? {...item, ...wordInfo} : item)
    );
  }

  return wordTodayList.length === 0 ? <></> : (
    <div className={`mx-4 ${className}`} onContextMenu={(e) => e.preventDefault()} onMouseDown={(e) => e.preventDefault()}>
      <Card className="h-full w-full overflow-scroll">
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
      </Card>
    </div>
  )
}

export default WordList