'use client';
import React, {memo, useEffect} from 'react';
import TabDefault from '@/app/components/Tabs/TabDefault';
import { useSentenceTodayStore } from '@/app/store/sentenceTodayStore';
import { useClassTypeList } from '@/app/swr/useSentenceToday';

type LevelListProps = {
  level?: string,
  idx?: number,
  onSearch?: (data: any) => any,
  onClick?: (data: any) => any,
}

const LevelList = (props: LevelListProps) => {
  const {
    level,
    idx = 0,
  } = props
  
  const wordTodayInfo =useSentenceTodayStore((state) => state.wordTodayInfo);
  const setWordTodayInfo = useSentenceTodayStore((state) => state.setWordTodayInfo);

  const {data: levelInfos = [], isLoading, error} = useClassTypeList({params: {ignoreLevels: ['N0', 'N6']}});

  const handleTabChange = (selectedData: any) => {
    setWordTodayInfo({...wordTodayInfo, ...selectedData});
  }

  useEffect(() => {
    setWordTodayInfo({...wordTodayInfo, level, idx});
  }, [level])

  return (
    <>
      <div className="px-4 mx-auto w-full m-10">
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
          <div className="rounded-t bg-white mb-0 px-6 py-6">
            <div className="text-center flex justify-between">
                <h6 className="text-blueGray-700 text-xl font-bold">오늘의 문장</h6>
                <strong></strong>
            </div>
          </div>
          <div className="flex-auto lg:px-10 py-4">
            <TabDefault onChange={handleTabChange} isUseContent={false} selectedIdx={wordTodayInfo.idx} data={
              (levelInfos[0]?.levels || []).map((item: any, idx: number) => {
                return {
                  title: item,
                };
              })} />
          </div>
        </div>
      </div>
    </>
  )
}

export default memo(LevelList)