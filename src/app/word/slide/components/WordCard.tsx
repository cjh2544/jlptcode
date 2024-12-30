'use client'
import { useInterval } from '@/app/utils/useInterval';
import React, {memo, useEffect, useState} from 'react';
import { boolean } from 'zod';

type WordCardProps = {
  wordInfo: any,
  wordShowType?: string,
  showDelay?: any,
  fullScreen: boolean,
}

const WordCard = (props: WordCardProps) => {
  const {
    wordInfo,
    wordShowType = '1',
    showDelay = 3000,
    fullScreen = false,
  } = props

  // const [showArr, setShowArr] = useState([false, false, false]);

  // const [count, setCount] = useState(0);
  // const [delay, setDelay] = useState(showDelay);

  // useInterval(() => {
  //   setShowArr(showArr.map((show: boolean, idx:number) => {
  //     return idx === count ? true : show;
  //   }));

  //   if(showArr.includes(false)) {
  //     setCount(count + 1)
  //   } else {
  //     setDelay(null);
  //   }
  // }, delay);

  // useEffect(() => {
  //   if('1' === wordShowType) {
  //     setShowArr([true, true, true]);
  //   } else if('2' === wordShowType) {
  //     setShowArr([true, true, false]);
  //   } else if('3' === wordShowType) {
  //     setShowArr([false, false, false]);
  //   }
  // }, [wordShowType])

  return (
    <>
      {wordInfo && (
          <div className={`${fullScreen ? 'h-[calc(100vh-80px)]' : 'h-96'} py-6 px-10 text-center flex flex-col items-center justify-center`}>
          <h3 className={`${wordInfo.hideWord ? 'hidden ' : '' } text-4xl font-normal leading-normal mt-0 mb-2 text-blueGray-800 w-full border-b`}>
            {wordInfo?.word || ' '}
          </h3>
          <h3 className={`${wordInfo.hideRead ? 'hidden' : '' } text-4xl font-normal leading-normal mt-0 mb-2 text-blueGray-800 w-full border-b`}>
            {wordInfo?.read || ' '}
          </h3>
          <h3 className={`${wordInfo.hideMeans ? 'hidden' : '' } text-4xl font-normal leading-normal mt-0 mb-2 text-blueGray-800 w-full whitespace-pre-line`}>
            {Array.isArray(wordInfo?.means) ? wordInfo?.means?.join('\n') : wordInfo?.means}
          </h3>
        </div>
      )}
    </>
  )
}

export default memo(WordCard)