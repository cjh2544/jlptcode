'use client'
import React, {memo} from 'react';

type WordCardProps = {
  wordInfo: any,
  fullScreen: boolean,
}

const WordCard = (props: WordCardProps) => {

  const {
    wordInfo,
    fullScreen = false,
  } = props

  return (
    <>
      {wordInfo && (
          <div className={`${fullScreen ? 'h-[calc(100vh-80px)]' : 'h-96'} py-6 px-10 text-center flex flex-col items-center justify-center`}>
          <h3 className="text-4xl font-normal leading-normal mt-0 mb-2 text-blueGray-800 w-full border-b">
            {wordInfo?.word || ' '}
          </h3>
          <h3 className="text-4xl font-normal leading-normal mt-0 mb-2 text-blueGray-800 w-full border-b">
            {wordInfo?.read || ' '}
          </h3>
          <h3 className="text-4xl font-normal leading-normal mt-0 mb-2 text-blueGray-800 w-full whitespace-pre-line">
            {Array.isArray(wordInfo?.means) ? wordInfo?.means?.join('\n') : wordInfo?.means}
          </h3>
        </div>
      )}
    </>
  )
}

export default memo(WordCard)