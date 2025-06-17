'use client';
import React, {ChangeEvent, memo, MouseEvent, useEffect} from 'react';
import TabDefault from '@/app/components/Tabs/TabDefault';
import { useSentenceTodayStore } from '@/app/store/sentenceTodayStore';
import { useClassTypeList } from '@/app/swr/useSentenceToday';
import Loading from '@/app/components/Loading/loading';
import { useStudyList } from '@/app/swr/useWordToday';

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
  const getWordTodayAllList = useSentenceTodayStore((state) => state.getWordTodayAllList);

  const {data: levelInfos = [], isLoading, error} = useClassTypeList({params: {ignoreLevels: ['N0', 'N6']}});
  const {data: studyList = []} = useStudyList({params: {ignoreLevels: ['N0', 'N6']}});

  const handleTabChange = (selectedData: any) => {
    setWordTodayInfo({...wordTodayInfo, ...selectedData});
  }

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    let eObj:any = {}
    let isSearch = true;

    eObj = {[e.target.name]: e.target.value};

    if(e.target.name === 'level') {
      eObj = {...eObj, idx: levelInfos[0]?.levels.findIndex((level: string, index: number, arr: any) => level === e.target.value)}
    } else if(e.target.name === 'study') {
      isSearch = false;
    }

    setWordTodayInfo({...wordTodayInfo, ...eObj}, isSearch);
  }

  const handleSearch = (e: MouseEvent<HTMLElement>) => {
    getWordTodayAllList();
  }

  useEffect(() => {
    setWordTodayInfo({...wordTodayInfo, level, idx});
  }, [])

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
          <div className="flex-auto lg:px-10 p-4">
            {isLoading ? (
              <Loading />
            ) : (
              <>
                <TabDefault onChange={handleTabChange} isUseContent={false} selectedIdx={wordTodayInfo.idx} data={
                  (levelInfos[0]?.levels || []).map((item: any, idx: number) => {
                    return {
                      title: item,
                    };
                  })} />

                <div className="flex items-center pb-3">
                  <span className="h-px flex-1 bg-gray-300"></span>
                  <span className="shrink-0 px-4 text-gray-900">or</span>
                  <span className="h-px flex-1 bg-gray-300"></span>
                </div>
                <div className='flex items-center justify-center gap-2'>
                  <select id="level" name="level" value={level} onChange={handleChange} className="border-0 py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150">
                    {(levelInfos[0]?.levels || []).map((item: any, idx: number) => {
                      return (<option key={idx} value={item}>{item === 'N0' ? '고득점' : item}</option>)
                    })}
                  </select>
                  <select id="study" name="study" onChange={handleChange} className="border-0 py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150">
                    <option value="">선택</option>
                    {(studyList.find((item: any) => item.level === level)?.studies ?? []).map((studyNm: any, idx: number) => {
                      return (<option key={idx} value={studyNm}>{studyNm}</option>)
                    })}
                  </select>
                  <button
                    className="bg-blueGray-700 active:bg-blueGray-600 text-white font-bold uppercase py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150 w-full"
                    type="button"
                    onClick={(e) => handleSearch(e)}
                  >
                    <i className="fas fa-search"></i> 조회
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default memo(LevelList)
