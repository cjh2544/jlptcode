'use client';
import React, {ChangeEvent, memo, MouseEvent, useEffect} from 'react';
import TabDefault from '@/app/components/Tabs/TabDefault';
import { useSpeakTodayStore } from '@/app/store/speakTodayStore';
import { useClassTypeList, useStudyList } from '@/app/swr/useSpeakToday';
import PaidButton from '@/app/components/Buttons/PaidButton';

type LevelListProps = {
  levels?: string,
  level?: string,
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

const studyLevelInfoList = [
  { name: '초급1', level: 'N5' },
  { name: '초급2', level: 'N4' },
  { name: '중급', level: 'N3' },
  { name: '고급1', level: 'N2' },
  { name: '고급2', level: 'N1' },
  { name: '드라마', level: 'N6' },
];

const LevelList = (props: LevelListProps) => {
  const {
    levels = 'N5', level = 'N5', idx = 0
  } = props
  
  const wordTodayInfo =useSpeakTodayStore((state:any) => state.wordTodayInfo);
  const setSpeakTodayInfo = useSpeakTodayStore((state:any) => state.setSpeakTodayInfo);
  const getSpeakTodayAllList = useSpeakTodayStore((state:any) => state.getSpeakTodayAllList);

  const {data: studyList = [], isLoading, error} = useStudyList({params: {level: wordTodayInfo.level || level}});

  const handleTabChange = (selectedData: any) => {
    setSpeakTodayInfo({...wordTodayInfo, ...selectedData, levels: selectedData.level.split(',')});
  }

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    let eObj:any = {}
    let isSearch = true;

    eObj = {[e.target.name]: e.target.value};

    if(e.target.name === 'level') {
      isSearch = false;
    } else if(e.target.name === 'study') {
      isSearch = false;
    }

    setSpeakTodayInfo({...wordTodayInfo, ...eObj}, isSearch);
  }

  const handleSearch = (e: MouseEvent<HTMLElement>) => {
    getSpeakTodayAllList();
  }

  useEffect(() => {
    setSpeakTodayInfo({...wordTodayInfo, level, levels: levels.split(','), study: '', idx});
  }, [])

  return (
    <>
      <div className="px-4 mx-auto w-full m-10">
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
          <div className="rounded-t bg-white mb-0 px-6 py-6">
            <div className="text-center flex justify-between">
                <h6 className="text-blueGray-700 text-xl font-bold">오늘의 회화학습</h6>
                <strong className='text-red-700'>★ 유료회원은 순서대로 학습 가능합니다.</strong>
            </div>
          </div>
          <div className="flex-auto lg:px-10 p-4">
            <TabDefault onChange={handleTabChange} isUseContent={false} selectedIdx={idx} data={
              levelInfoList.map((item: any, idx: number) => {
                return {
                  title: item.levels.toString(),
                  displayName: item.name,
                };
              })
            }/>
            <div className="flex items-center pb-3">
              <span className="h-px flex-1 bg-gray-300"></span>
              <span className="shrink-0 px-4 text-gray-900">or</span>
              <span className="h-px flex-1 bg-gray-300"></span>
            </div>
            <div className='grid grid-cols-3 sm:grid-cols-2 items-center justify-center gap-2'>
              <select id="level" name="level" value={level} onChange={handleChange} className="border-0 py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150">
                {studyLevelInfoList.map((item: any, idx: number) => {
                  return (<option key={item.level} value={item.level}>{item.name}</option>)
                })}
              </select>
              <select id="study" name="study" onChange={handleChange} className="border-0 py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150">
                <option value="">선택</option>
                {(studyList.find((item: any) => item.level === level)?.studies ?? []).map((studyNm: any, idx: number) => {
                  return (<option key={idx} value={studyNm}>{studyNm}</option>)
                })}
              </select>
              {/* <button
                className="bg-blueGray-700 active:bg-blueGray-600 text-white font-bold uppercase py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150 w-full"
                type="button"
                onClick={(e) => handleSearch(e)}
              >
                <i className="fas fa-search"></i> 조회
              </button> */}
              <PaidButton className="w-full sm:col-span-2" onClick={handleSearch} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default memo(LevelList)
