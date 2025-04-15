'use client'
import React, {memo} from 'react';
import { MouseEvent } from 'react';
import { sortBy } from 'lodash';

type ClassificationProps = {
  classData: any,
  onClick?: (data: any) => any,
}

const Classification = (props: ClassificationProps) => {

  const {
    classData,
    onClick
  } = props

  const handleClick = (selectedData: any) => (e: MouseEvent<HTMLElement>) => {
    onClick && onClick(selectedData);
  }

  return (
    <>
      <div className="grid grid-cols-4 gap-4 sm:grid-cols-2">
        <button onClick={handleClick({classification: 'vocabulary'})} className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button">
          문자어휘 文字語彙 <br/> VOCABULARY
        </button>
        <button onClick={handleClick({classification: 'grammar'})} className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button">
          문법 文法 <br/> GRAMMAR
        </button>
        <button onClick={handleClick({classification: 'listening'})} className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button">
          청해 聴解 <br/> Listening
        </button>
        <button onClick={handleClick({classification: 'reading'})} className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button">
          독해 読解 <br/> Reading
        </button>
      </div>
    </>
  )
}

export default memo(Classification)