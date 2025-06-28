"use client"; // 필수!
import { useJlptStore } from '@/app/store/jlptStore';
import JlptLayout from '@/app/components/Layout/JlptLayout'
import Question from '../components/question';
import { memo, useEffect } from 'react';
import ModalAnswer from '../components/modalAnswer';
import Loading from '@/app/components/Loading/loading';
import { isEmpty } from 'lodash';
import EmptyData from '@/app/components/Alert/EmptyData';

const JlptTestPage = () => {
  const searchInfo = useJlptStore((state:any) => state.searchInfo);
  const jlptList = useJlptStore((state:any) => state.jlptList);
  const isLoading = useJlptStore((state:any) => state.isLoading);
  const showAnswer = useJlptStore((state:any) => state.showAnswer);
  const setShowAnswer = useJlptStore((state:any) => state.setShowAnswer);

  
  // 1. 과목 키 타입 정의
  type ClassificationKey  = "vocabulary" | "grammar" | "reading" | "listening";
  
  const classificationContentMap: Record<ClassificationKey, JSX.Element> = {
    vocabulary: <p>文字語彙</p>,
    grammar: <p>文法</p>,
    reading: <p>読解</p>,
    listening: <p>聴解</p>,
  };

  const isClassificationKey = (key: any): key is ClassificationKey =>
    ['vocabulary', 'grammar', 'reading', 'listening'].includes(key);

  const classification = searchInfo.classification;

  return <>
    <JlptLayout>
      {isLoading ? (
        <Loading />
      ) : (
      <div onContextMenu={(e) => e.preventDefault()} onMouseDown={(e) => e.preventDefault()} className="px-4 mx-auto w-full m-10">
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
          <div className="rounded-t bg-white mb-0 px-6 py-6 shadow-lg">
            <div className="text-center flex justify-between">
              <h6 className="text-blueGray-700 text-xl font-bold">
                {isClassificationKey(classification) && classificationContentMap[classification]}
              </h6>
              <div className='flex'>
                <div className="flex items-center mr-1">
                  <input id="show-answer-checkbox" type="checkbox" checked={showAnswer} onChange={() => setShowAnswer(!showAnswer)} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2" />
                  <label htmlFor="show-answer-checkbox" className="ms-2 text-sm font-medium text-gray-900">정답 바로보기</label>
                </div>
                <span
                  className="bg-blueGray-700 active:bg-blueGray-600 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                >
                  {`${searchInfo.year}/${searchInfo.month} - ${searchInfo.level}`}
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
            <ModalAnswer title={`${searchInfo.year}/${searchInfo.month} - ${searchInfo.level}`} />
          </div>
        </div>
      </div>
      )}
    </JlptLayout>
  </>
}

export default memo(JlptTestPage)