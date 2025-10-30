"use client"; // 필수!
import { useStrategyStore } from '@/app/store/strategyStore';
import Question from './question';
import { memo, ReactNode, useEffect, useState } from 'react';
import ModalAnswer from './modalAnswer';
import Loading from '@/app/components/Loading/loading';
import { useSession } from "next-auth/react";
import ModalConfirm from '@/app/components/Modals/ModalConfirm';

const QuestionTestPage = () => {
  const { levelUpInfo, levelUpList, isLoading } = useStrategyStore((state:any) => state);
  const showReadButton = useStrategyStore((state:any) => state.showReadButton);
  const showTransButton = useStrategyStore((state:any) => state.showTransButton);
  const showAnswer = useStrategyStore((state:any) => state.showAnswer);
  const showSpeakButton = useStrategyStore((state:any) => state.showSpeakButton);
  const setStoreData = useStrategyStore((state:any) => state.setStoreData);
  const getLevelUpList = useStrategyStore((state:any) => state.getLevelUpList);
  const init = useStrategyStore((state:any) => state.init);

  const [confirmMsg, setConfirmMsg] = useState<ReactNode>('')
  const [confirmType, setConfirmType] = useState<any>('info')
  const [isShowConfirm, setShowConfirm] = useState<boolean>(false)
  const { data: session } = useSession();

  const handleChangeCheck = (key: string, value: any) => {
    if(!session?.paymentInfo?.isValid) {
      setConfirmMsg(<>유료회원만이 이용가능합니다.<br />문의게시판에 “유료회원안내”을 확인해 주세요.</>);
      setShowConfirm(true);
      return;
    }

    setStoreData(key, value)
  }

  useEffect(() => {
    init();
    // getLevelUpList();
  }, [])

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
                <input id="show-read-checkbox" type="checkbox" checked={showReadButton} onChange={() => handleChangeCheck('showReadButton', !showReadButton)} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2" />
                <label htmlFor="show-read-checkbox" className="ms-2 text-sm font-medium text-gray-900">읽기</label>
              </div>
              <div className="flex items-center mr-1">
                <input id="show-trans-checkbox" type="checkbox" checked={showTransButton} onChange={() => handleChangeCheck('showTransButton', !showTransButton)} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2" />
                <label htmlFor="show-trans-checkbox" className="ms-2 text-sm font-medium text-gray-900">해석</label>
              </div>
              <div className="flex items-center mr-1">
                <input id="show-trans-checkbox" type="checkbox" checked={showSpeakButton} onChange={() => handleChangeCheck('showSpeakButton', !showSpeakButton)} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2" />
                <label htmlFor="show-trans-checkbox" className="ms-2 text-sm font-medium text-gray-900">발음</label>
              </div>
              <div className="flex items-center mr-1">
                <input id="show-answer-checkbox" type="checkbox" checked={showAnswer} onChange={() => handleChangeCheck('showAnswer', !showAnswer)} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2" />
                <label htmlFor="show-answer-checkbox" className="ms-2 text-sm font-medium text-gray-900">정답</label>
              </div>
              <span
                className="bg-blueGray-700 active:bg-blueGray-600 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
              >
                {`${levelUpInfo.level}`}
              </span>
            </div>
            <ModalConfirm type={confirmType} message={confirmMsg} visible={isShowConfirm} onClose={(visible: boolean) => setShowConfirm(visible)} />
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