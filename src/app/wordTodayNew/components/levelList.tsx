'use client';
import React, {memo, useEffect} from 'react';
import TabDefault from '@/app/components/Tabs/TabDefault';
import { useWordTodayNewStore } from '@/app/store/wordTodayNewStore';
import { useClassTypeListNew } from '@/app/swr/useWordToday';

type LevelListProps = {
  level?: string,
  selectedIdx?: number,
  onSearch?: (data: any) => any,
  onClick?: (data: any) => any,
}

const LevelList = (props: LevelListProps) => {
  const {
    level, selectedIdx = 0
  } = props
  
  const wordTodayInfo =useWordTodayNewStore((state) => state.wordTodayInfo);
  const setWordTodayInfo = useWordTodayNewStore((state) => state.setWordTodayInfo);

  const {data: levelInfos = [], isLoading, error} = useClassTypeListNew({params: {level: wordTodayInfo.level || level}});

  const handleTabChange = (selectedData: any) => {
    setWordTodayInfo({...wordTodayInfo, ...selectedData});
  }

  useEffect(() => {
    setWordTodayInfo({...wordTodayInfo, level: level});
  }, [level])

  return (
    <>
      <div className="px-4 mx-auto w-full m-10">
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
          <div className="rounded-t bg-white mb-0 px-6 py-6">
            <div className="text-center flex justify-between">
                <h6 className="text-blueGray-700 text-xl font-bold">오늘의 단어</h6>
                <strong></strong>
            </div>
          </div>
          <div className="flex-auto lg:px-10 py-4">
            <TabDefault onChange={handleTabChange} isUseContent={false} selectedIdx={selectedIdx} data={
              (levelInfos[0]?.levels || []).map((item: any, idx: number) => {
                return {
                  title: item,
                  displayName: item === 'N0' ? '고득점' : item,
                };
              })} />
          </div>
        </div>
      </div>
    </>
  )
}

export default memo(LevelList)