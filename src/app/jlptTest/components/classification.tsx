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

  const handleClick = (classification: string, test: string) => (e: MouseEvent<HTMLElement>) => {
    onClick && onClick({classification, test});
  }

  const coolRegex = /\d+/;

  const sortYears = (years: any) => {
    let testYears:any = [];
    let studyYears:any = [];

    years.map((year:string, idx: number) => {
      if(year.toLowerCase().indexOf('test') > -1) {
        testYears.push(year);
      } else if(year.toLowerCase().indexOf('study') > -1) {
        studyYears.push(year);
      }
    })

    testYears.sort((a: any, b: any) => {
      return a.match(coolRegex) - b.match(coolRegex)
    })

    studyYears.sort((a: any, b: any) => {
      return a.match(coolRegex) - b.match(coolRegex)
    })

    return [...testYears, ...studyYears];
  }
  
  return (
    <>
      {classData.classifications.map((classificationInfo: any, cIdx: number) => {
        return (
          <div key={`class-${cIdx}`}>
            <h3 className="text-center text-2xl font-normal leading-normal mt-0 mb-2 text-blueGray-800 uppercase shadow-lg shadow-blue-500/50 p-2 mt-2">
              {classificationInfo.classificationNm}
            </h3>
            <div className="grid grid-cols-4 gap-4 sm:grid-cols-2">
              {sortYears(classificationInfo.years).map((test: string, yIdx: number) => {
                return (
                  <button key={`btn-${cIdx}-${yIdx}`} onClick={handleClick(classificationInfo.classification, test)} className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button">
                    {`${test}`}
                  </button>
                )
              })}
            </div>
          </div>
        );
      })}
    </>
  )
}

export default memo(Classification)