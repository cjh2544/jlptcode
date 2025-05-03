"use client"; // 필수!
import { useStrategyStore } from '@/app/store/strategyStore';
import Question from './question';
import { memo } from 'react';
import ModalAnswer from './modalAnswer';
import StrategyLayout from '@/app/components/Layout/StrategyLayout';
import Loading from '@/app/components/Loading/loading';
import { useJlptStore } from '@/app/store/jlptStore';

const QuestionTestPage = () => {
  const { levelUpInfo, levelUpList, isLoading } = useStrategyStore((state) => state);
  const showAnswer = useStrategyStore((state) => state.showAnswer);
  const setStoreData = useStrategyStore((state) => state.setStoreData);

  return <>
    {isLoading ? (
      <Loading />
    ) : (
    <div onContextMenu={(e) => e.preventDefault()} onMouseDown={(e) => e.preventDefault()} className="px-4 mx-auto w-full m-10">
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
        <div className="rounded-t bg-white mb-0 px-6 py-6 shadow-lg">
          <div className="text-center flex justify-between">
            <h6 className="text-blueGray-700 text-xl font-bold">집중공략</h6>
            <div className='flex'>
              <div className="flex items-center mr-1">
                <input id="show-answer-checkbox" type="checkbox" checked={showAnswer} onChange={() => setStoreData('showAnswer', !showAnswer)} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2" />
                <label htmlFor="show-answer-checkbox" className="ms-2 text-sm font-medium text-gray-900">정답 바로보기</label>
              </div>
              <span
                className="bg-blueGray-700 active:bg-blueGray-600 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
              >
                {`${levelUpInfo.level}`}
              </span>
            </div>
          </div>
        </div>
        <div className="flex-auto bg-white mt-2 sm:p-2 lg:px-10 p-10">
            {levelUpList.map((questionInfo: any, idx: number) => {
              return (<Question key={`strategy-test-${idx}`} questionInfo={questionInfo} />)
            })}
        </div>
        <div className="rounded-b bg-white mb-0 border-t p-6 sticky bottom-0 z-50">
          <ModalAnswer title={`JLPT 모의고사 - ${levelUpInfo.level}`} />
        </div>
      </div>
    </div>
    )}
  </>
}

export default memo(QuestionTestPage)