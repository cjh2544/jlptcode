'use client';
import React, {memo, useEffect} from 'react';
import TabDefault from '@/app/components/Tabs/TabDefault';
import { useReadingTodayStore } from '@/app/store/readingTodayStore';
import { useClassTypeList } from '@/app/swr/useReadingToday';
import Loading from '@/app/components/Loading/loading';

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
  
  const readingTodayInfo =useReadingTodayStore((state:any) => state.readingTodayInfo);
  const readingTodayList =useReadingTodayStore((state:any) => state.readingTodayList);
  const setReadingTodayInfo = useReadingTodayStore((state:any) => state.setReadingTodayInfo);
  const setReadingTodayList = useReadingTodayStore((state:any) => state.setReadingTodayList);

  const {data: levelInfos = [], isLoading, error} = useClassTypeList({ params: {} });

  const handleTabChange = (selectedData: any) => {
    setReadingTodayInfo({...readingTodayInfo, ...selectedData});
    setReadingTodayList(
      readingTodayList.map((item, idx) => ({
        ...item, 
        hideSentence: false,
        hideSentenceRead: true,
        hideSentenceTranslate: true
      }))
    );
  }

  useEffect(() => {
    setReadingTodayInfo({...readingTodayInfo, level, idx});
  }, [])

  return (
    <>
      <div className="px-4 mx-auto w-full m-10">
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
          <div className="rounded-t bg-white mb-0 px-6 py-6">
            <div className="text-center flex justify-between">
                <h6 className="text-blueGray-700 text-xl font-bold">오늘의 독해</h6>
                <strong></strong>
            </div>
          </div>
          <div className="flex-auto lg:px-10 py-4">
            {isLoading ? (
              <Loading />
            ) : (
              <TabDefault onChange={handleTabChange} isUseContent={false} selectedIdx={readingTodayInfo.idx} data={
                (levelInfos[0]?.levels || []).map((item: any, idx: number) => {
                  return {
                    title: item,
                    displayName: item === 'N0' ? '고급' : item
                  };
                })} />
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default memo(LevelList)
