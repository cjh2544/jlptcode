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
    levels = 'N5', idx = 0
  } = props
  
  const wordTodayInfo =useSpeakTodayStore((state:any) => state.wordTodayInfo);
  const setSpeakTodayInfo = useSpeakTodayStore((state:any) => state.setSpeakTodayInfo);
  const getSpeakTodayAllList = useSpeakTodayStore((state:any) => state.getSpeakTodayAllList);
  const init = useSpeakTodayStore((state:any) => state.init);

  const {data: studyList = [], isLoading, error} = useStudyList({params: {level: wordTodayInfo.level}});

  const handleTabChange = (selectedData: any) => {

    setSpeakTodayInfo({...wordTodayInfo, ...selectedData, levels: selectedData.level.split(','), level: wordTodayInfo.level});
  }

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    let eObj:any = {}
    let isSearch = true;

    eObj = {[e.target.name]: e.target.value};

    if(e.target.name === 'level') {
      isSearch = false;
      eObj = {...eObj, study: ''};
    } else if(e.target.name === 'study') {
      isSearch = false;
    }

    setSpeakTodayInfo({...wordTodayInfo, ...eObj}, isSearch);
  }

  const handleSearch = (e: MouseEvent<HTMLElement>) => {
    getSpeakTodayAllList();
  }

  useEffect(() => {
    init();
  }, [])

  return (
    <>
      <div className="px-4 mx-auto w-full m-10">
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
          <div className="rounded-t bg-white mb-0 px-6 py-6">
            <div className="text-center flex justify-between">
                <h6 className="text-blueGray-700 text-xl font-bold">스피킹 완전정복 100일</h6>
                <strong className='text-red-700'>★ 스피킹은 단어 문법 청해, 모두를 향상 시킵니다.</strong>
            </div>
          </div>
          <div className="flex-auto lg:px-10 p-4">
            <div className='grid grid-cols-3 sm:grid-cols-2 items-center justify-center gap-2'>
              <select id="level" name="level" value={wordTodayInfo.level} onChange={handleChange} className="border-0 py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150">
                {studyLevelInfoList.map((item: any, idx: number) => {
                  return (<option key={item.level} value={item.level}>{item.name}</option>)
                })}
              </select>
              <select id="study" name="study" value={wordTodayInfo.study} onChange={handleChange} className="border-0 py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150">
                <option value="">선택</option>
                {(studyList.find((item: any) => item.level === wordTodayInfo.level)?.studies ?? []).map((studyNm: any, idx: number) => {
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
