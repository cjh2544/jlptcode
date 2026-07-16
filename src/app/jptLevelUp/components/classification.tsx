'use client'
import React, {memo} from 'react';
import { MouseEvent } from 'react';
import { sortBy } from 'lodash';
import { useTranslations } from '@/app/providers/I18nProvider';

type ClassificationProps = {
  classData: any,
  onClick?: (data: any) => any,
}

const Classification = (props: ClassificationProps) => {
  const { t } = useTranslations();

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
        <button onClick={handleClick({part: 'part2'})} className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button">
          PART2<br/>{t('levelUp.qa')}
        </button>
        <button onClick={handleClick({part: 'part3'})} className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button">
          PART3<br/>{t('levelUp.conversation')}
        </button>
        <button onClick={handleClick({part: 'part5'})} className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button">
          PART5<br/>{t('levelUp.findAnswer')}
        </button>
        <button onClick={handleClick({part: 'part7'})} className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button">
          PART7<br/>{t('levelUp.fillBlank')}
        </button>
        <button onClick={handleClick({part: 'part8'})} className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button">
          PART8<br/>{t('levelUp.reading')}
        </button>
      </div>
    </>
  )
}

export default memo(Classification)
