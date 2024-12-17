'use client';
import { useWordStore } from '@/app/store/wordStore';
import { Button } from "@material-tailwind/react";
import { memo } from 'react';

type HeaderButtonProps = {
  colName: string,
}

const HeaderListButton = ({colName}: HeaderButtonProps) => {
  const hideAll = useWordStore(state => state.hideAll);
  const setHideAllInfo = useWordStore(state => state.setHideAllInfo);

  const handleClickHeader = (colName: string) => {
    setHideAllInfo({...hideAll, [colName]: !hideAll[colName]});
  }

  return (
    <>
      <Button onClick={(e) => handleClickHeader(colName)} className='p-0 text-blue-600 focus:outline-none text-right' variant="text">
        <span className='mr-1'>
          {
            {
              'word': '단어',
              'read': '읽기',
              'means': '뜻',
            }[colName]
          }
        </span>
        <i className={`${hideAll[colName] ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash'}`}></i>
      </Button>
    </>
  )
}

export default memo(HeaderListButton)