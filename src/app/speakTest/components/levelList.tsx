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

const LevelList = (props: LevelListProps) => {
  const {
    levels = 'N5', idx = 0
  } = props
  
  const wordTodayInfo =useSpeakTodayStore((state:any) => state.wordTodayInfo);
  const setSpeakTodayInfo = useSpeakTodayStore((state:any) => state.setSpeakTodayInfo);
  const getSpeakTodayList = useSpeakTodayStore((state:any) => state.getSpeakTodayList);
  const hideAll = useSpeakTodayStore((state:any) => state.hideAll);
  const setHideAllInfo = useSpeakTodayStore(state => state.setHideAllInfo);

  const handleClickHeader = (colName: string) => {
    setHideAllInfo({...hideAll, [colName]: !hideAll[colName]});
  }

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    let eObj:any = {}
    let isSearch = true;

    
    if(e.target.name === 'levels') {
      isSearch = false;
      eObj = {[e.target.name]: e.target.value.split(',')};
    } else if(e.target.name === 'study') {
      isSearch = false;
    }

    setSpeakTodayInfo({...wordTodayInfo, ...eObj}, isSearch);
  }

  const handleSearch = (e: MouseEvent<HTMLElement>) => {
    getSpeakTodayList();
  }

  useEffect(() => {
    setSpeakTodayInfo({...wordTodayInfo, level: wordTodayInfo.level, levels: levels.split(','), study: '', idx});
  }, [])

  return (
    <>
      <div className="px-4 mx-auto w-full m-10 sticky top-0">
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
          <div className="rounded-t bg-white mb-0 px-6 py-6">
            <div className="text-center flex justify-between">
                <h6 className="text-blueGray-700 text-xl font-bold">스피킹 테스트</h6>
                <strong className='text-red-700'>★ 유료회원은 스피킹 완전정복100일에서 순서대로 학습 가능합니다.</strong>
            </div>
          </div>
          <div className="flex justify-between lg:px-10 p-4">
            <div className='flex gap-2'>
              <select id="levels" name="levels" value={setSpeakTodayInfo.levels} onChange={handleChange} className="border-0 placeholder-blueGray-300 text-blueGray-600 bg-white rounded shadow focus:outline-none focus:ring ease-linear transition-all duration-150">
                  {levelInfoList.map((item: any, idx: number) => {
                    return (<option key={idx} value={item.levels.toString()}>{item.name}</option>)
                  })}
              </select>
              <button onClick={handleSearch} className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150 px-3 py-2" type="button">
                <i className={`fas fa-search`}></i> 조회
              </button>
              <button onClick={handleSearch} className="bg-green-500 text-white active:bg-green-600 font-bold uppercase rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150 px-3 py-2" type="button">
                <i className={`fas fa-play`}></i> 시작
              </button>
            </div>
            <div className='flex'>
              <div className="flex items-center mr-1">
                <input id="show-speak-checkbox" type="checkbox" checked={!hideAll.speak} onChange={() => handleClickHeader('speak')} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2" />
                <label htmlFor="show-speak-checkbox" className="ms-2 text-sm font-medium text-gray-900">발음</label>
              </div>
              <div className="flex items-center mr-1">
                <input id="show-keyword-checkbox" type="checkbox" checked={!hideAll.keyword} onChange={() => handleClickHeader('keyword')} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2" />
                <label htmlFor="show-keyword-checkbox" className="ms-2 text-sm font-medium text-gray-900">키워드</label>
              </div>
              <div className="flex items-center mr-1">
                <input id="show-sentence-checkbox" type="checkbox" checked={!hideAll.sentence} onChange={() => handleClickHeader('sentence')} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2" />
                <label htmlFor="show-sentence-checkbox" className="ms-2 text-sm font-medium text-gray-900">문장</label>
              </div>
              <div className="flex items-center mr-1">
                <input id="show-sentenceread-checkbox" type="checkbox" checked={!hideAll.sentence_read} onChange={() => handleClickHeader('sentence_read')} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2" />
                <label htmlFor="show-sentenceread-checkbox" className="ms-2 text-sm font-medium text-gray-900">읽기</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default memo(LevelList)
