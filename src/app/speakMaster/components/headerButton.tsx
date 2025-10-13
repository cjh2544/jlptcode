'use client';
import { useWordTodayStore } from '@/app/store/wordTodayStore';
import { Button } from "@material-tailwind/react";
import { memo } from 'react';

type HeaderButtonProps = {
  colName: string,
}

const HeaderButton = ({colName}: HeaderButtonProps) => {
  const hideAll = useWordTodayStore(state => state.hideAll);
  const setHideAllInfo = useWordTodayStore(state => state.setHideAllInfo);

  const handleClickHeader = (colName: string) => {
    setHideAllInfo({...hideAll, [colName]: !hideAll[colName]});
  }

  return (
    <>
    <Button onClick={(e) => handleClickHeader(colName)} className='p-0 text-blue-600 focus:outline-none' variant="text">
      <i className={`${hideAll[colName] ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash'}`}></i>
    </Button>
    </>
  )
}

export default memo(HeaderButton)