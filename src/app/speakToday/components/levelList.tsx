'use client';
import React, {memo, useEffect} from 'react';
import TabDefault from '@/app/components/Tabs/TabDefault';
import { useSpeakTodayStore } from '@/app/store/speakTodayStore';
import { useClassTypeList } from '@/app/swr/useSpeakToday';

type LevelListProps = {
  levels?: string,
  idx?: number,
  onSearch?: (data: any) => any,
  onClick?: (data: any) => any,
}

const levelInfoList = [
  { name: '초급', levels: ['N5'] },
  { name: '중급', levels: ['N3', 'N4'] },
  { name: '고급', levels: ['N1', 'N2'] },
  { name: '드라마', levels: ['N6'] },
  { name: 'TOTAL', levels: ['N1', 'N2', 'N3', 'N4', 'N5', 'N6'] },
];

const LevelList = (props: LevelListProps) => {
  const {
    levels = 'N5', idx = 0
  } = props
  
  const wordTodayInfo =useSpeakTodayStore((state) => state.wordTodayInfo);
  const setSpeakTodayInfo = useSpeakTodayStore((state) => state.setSpeakTodayInfo);

  // const {data: levelInfos = [], isLoading, error} = useClassTypeListNew({params: {level: wordTodayInfo.level || level}});

  const handleTabChange = (selectedData: any) => {
    setSpeakTodayInfo({...wordTodayInfo, ...selectedData, level: '', levels: selectedData.level.split(',')});
  }

  useEffect(() => {
    setSpeakTodayInfo({...wordTodayInfo, level: '', levels: levels.split(','), idx});
  }, [levels])

  return (
    <>
      <div className="px-4 mx-auto w-full m-10">
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
          <div className="rounded-t bg-white mb-0 px-6 py-6">
            <div className="text-center flex justify-between">
                <h6 className="text-blueGray-700 text-xl font-bold">오늘의 회화학습</h6>
                {/* <strong></strong> */}
            </div>
          </div>
          <div className="flex-auto lg:px-10 py-4">
            <TabDefault onChange={handleTabChange} isUseContent={false} selectedIdx={idx} data={
              levelInfoList.map((item: any, idx: number) => {
                return {
                  title: item.levels.toString(),
                  displayName: item.name,
                };
              })
            }/>
          </div>
        </div>
      </div>
    </>
  )
}

export default memo(LevelList)