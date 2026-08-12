'use client';
import { useWordTodayStore } from '@/app/store/wordTodayStore';
import { Button } from "@/components/ui/button";
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
    <Button onClick={(e) => handleClickHeader(colName)} className='p-0 text-blue-600 focus:outline-hidden' variant="ghost">
      <i className={`${hideAll[colName] ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash'}`}></i>
    </Button>
    </>
  )
}

export default memo(HeaderButton)