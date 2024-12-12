'use client';
import { useGrammarTodayStore } from '@/app/store/grammarTodayStore';
import { Button } from "@material-tailwind/react";
import { memo } from 'react';

type HeaderButtonProps = {
  colName: string,
}

const HeaderButton = ({colName}: HeaderButtonProps) => {
  const hideAll = useGrammarTodayStore(state => state.hideAll);
  const setHideAllInfo = useGrammarTodayStore(state => state.setHideAllInfo);

  const handleClickHeader = (colName: string) => {
    setHideAllInfo({...hideAll, [colName]: !hideAll[colName]});
  }

  return (
    <>
      <Button onClick={(e) => handleClickHeader(colName)} className='p-0 text-blue-600 focus:outline-none text-right' variant="text">
        <span className='mr-1'>
          {
            {
              'sentence': '文章',
              'sentence_read': '読み方',
              'sentence_translate': '意味',
            }[colName]
          }
        </span>
        <i className={`${hideAll[colName] ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash'}`}></i>
      </Button>
    </>
  )
}

export default memo(HeaderButton)