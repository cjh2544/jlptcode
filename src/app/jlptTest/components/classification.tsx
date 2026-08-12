'use client'
import React, {memo} from 'react';
import { MouseEvent } from 'react';

type ClassificationProps = {
  classData: any,
  onClick?: (data: any) => any,
}

const Classification = (props: ClassificationProps) => {
  const { classData, onClick } = props

  const handleClick = (classification: string, test: string) => (e: MouseEvent<HTMLElement>) => {
    onClick && onClick({ classification, test });
  }

  return (
    <>
      {(classData?.classifications ?? []).map((classificationInfo: any, cIdx: number) => (
        <div key={`class-${cIdx}`}>
          <h3 className="app-classification-title">
            {classificationInfo.classificationNm}
          </h3>
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-2">
            {(classificationInfo.years ?? []).map((test: string, yIdx: number) => (
              <button
                key={`btn-${cIdx}-${yIdx}`}
                onClick={handleClick(classificationInfo.classification, test)}
                className="app-year-btn"
                type="button"
              >
                {test}
              </button>
            ))}
          </div>
        </div>
      ))}
    </>
  )
}

export default memo(Classification)
