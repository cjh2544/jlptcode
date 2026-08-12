'use client'
import React, {memo} from 'react';
import { MouseEvent } from 'react';

type ClassificationProps = {
  classData: any,
  onClick?: (data: any) => any,
}

const Classification = (props: ClassificationProps) => {

  const {
    classData,
    onClick
  } = props

  const handleClick = (classification: string, yearStr: string) => (e: MouseEvent<HTMLElement>) => {
    const [year, month] = yearStr.split('/');
    onClick && onClick({classification, year, month});
  }

  return (
    <>
      {(classData?.classifications ?? []).map((classificationInfo: any, cIdx: number) => {
        return (
          <div key={`class-${cIdx}`}>
            <h3 className="app-classification-title">
              {classificationInfo.classificationNm}
            </h3>
            <div className="grid grid-cols-4 gap-3 sm:grid-cols-2">
            {(classificationInfo.years ?? []).map((year: string, yIdx: number) => {
                return (
                  <button
                    key={`btn-${cIdx}-${yIdx}`}
                    onClick={handleClick(classificationInfo.classification, year)}
                    className="app-year-btn"
                    type="button"
                  >
                    {year}
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
