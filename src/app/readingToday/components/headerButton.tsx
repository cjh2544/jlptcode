'use client';
import VisibilityIcon from "@/app/components/Icons/VisibilityIcon";
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
      <Button onClick={(e) => handleClickHeader(colName)} className='p-0 text-blue-600 focus:outline-hidden text-right' variant="ghost">
        <span className='mr-1'>
          {
            {
              'sentence': '\u6587\u7AE0',
              'sentence_read': '\u8AAD\u307F\u65B9',
              'sentence_translate': '\u610F\u5473',
            }[colName]
          }
        </span>
        <VisibilityIcon hidden={!!hideAll[colName]} />
      </Button>
    </>
  )
}

export default memo(HeaderButton)
