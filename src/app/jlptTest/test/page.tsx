"use client"; // 필수!
import { useJlptTestStore } from '@/app/store/jlptTestStore';
import Question from '../components/question';
import { memo, useEffect } from 'react';
import ModalAnswer from '../components/modalAnswer';
import Loading from '@/app/components/Loading/loading';
import { isEmpty } from 'lodash';
import EmptyData from '@/app/components/Alert/EmptyData';
import JlptTestLayout from '@/app/components/Layout/JlptTestLayout';

const JlptTestPage = () => {
  const searchInfo = useJlptTestStore((state:any) => state.searchInfo);
  const jlptList = useJlptTestStore((state:any) => state.jlptList);
  const isLoading = useJlptTestStore((state:any) => state.isLoading);
  const showAnswer = useJlptTestStore((state:any) => state.showAnswer);
  const showReadButton = useJlptTestStore((state:any) => state.showReadButton);
  const showTransButton = useJlptTestStore((state:any) => state.showTransButton);
  const setShowAnswer = useJlptTestStore((state:any) => state.setShowAnswer);
  const setStoreData = useJlptTestStore((state:any) => state.setStoreData);

  return <>
    <JlptTestLayout>
      {isLoading ? (
        <Loading />
      ) : (
      <div onContextMenu={(e) => e.preventDefault()} onMouseDown={(e) => e.preventDefault()} className="px-4 mx-auto w-full m-10">
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
          <div className="rounded-t bg-white mb-0 px-6 py-6 shadow-lg">
            <div className="text-center flex justify-between">
              <h6 className="text-blueGray-700 text-xl font-bold">
              {
                { 
                  vocabulary : "文字語彙",
                  grammar : "文法",
                  reading : "読解",
                  listening : "聴解",
                }[searchInfo.classification]
              }
              </h6>
              <div className='flex'>
                <div className="flex items-center mr-1">
                  <input id="show-read-checkbox" type="checkbox" checked={showReadButton} onChange={() => setStoreData('showReadButton', !showReadButton)} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2" />
                  <label htmlFor="show-read-checkbox" className="ms-2 text-sm font-medium text-gray-900">읽기</label>
                </div>
                <div className="flex items-center mr-1">
                  <input id="show-trans-checkbox" type="checkbox" checked={showTransButton} onChange={() => setStoreData('showTransButton', !showTransButton)} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2" />
                  <label htmlFor="show-trans-checkbox" className="ms-2 text-sm font-medium text-gray-900">해석</label>
                </div>
                <div className="flex items-center mr-1">
                  <input id="show-answer-checkbox" type="checkbox" checked={showAnswer} onChange={() => setShowAnswer(!showAnswer)} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2" />
                  <label htmlFor="show-answer-checkbox" className="ms-2 text-sm font-medium text-gray-900">정답 바로보기</label>
                </div>
                <span
                  className="bg-blueGray-700 active:bg-blueGray-600 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                >
                  {`${searchInfo.test} - ${searchInfo.level}`}
                </span>
              </div>
            </div>
          </div>
          <div className="flex-auto bg-white mt-2 sm:p-2 lg:px-10 p-10">
              {isEmpty(jlptList) ? (
                <EmptyData text='문제를 준비중입니다.' className='bg-blueGray-100' />
              ) : (<></>)}
              {jlptList.map((questionInfo: any, idx: number) => {
                return (<Question key={`jlpt-test-${idx}`} questionInfo={questionInfo} />)
              })}
          </div>
          <div className="rounded-b bg-white mb-0 border-t p-6 sticky bottom-0 z-50 uppercase">
            <ModalAnswer title={`${searchInfo.test} - ${searchInfo.level}`} />
          </div>
        </div>
      </div>
      )}
    </JlptTestLayout>
  </>
}

export default memo(JlptTestPage)