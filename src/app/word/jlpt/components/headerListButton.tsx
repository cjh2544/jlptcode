'use client';
import { useWordStore } from '@/app/store/wordStore';
import { Button } from "@/components/ui/button";
import { memo } from 'react';
import { useTranslations } from '@/app/providers/I18nProvider';

type HeaderButtonProps = {
  colName: string,
}

const HeaderListButton = ({colName}: HeaderButtonProps) => {
  const { t } = useTranslations();
  const hideAll = useWordStore(state => state.hideAll);
  const setHideAllInfo = useWordStore(state => state.setHideAllInfo);

  const handleClickHeader = (colName: string) => {
    setHideAllInfo({...hideAll, [colName]: !hideAll[colName]});
  }

  return (
    <>
      <Button onClick={(e) => handleClickHeader(colName)} className='p-0 text-blue-600 focus:outline-hidden text-right' variant="ghost">
        <span className='mr-1'>
          {
            {
              'word': t('word.word'),
              'read': t('word.reading'),
              'means': t('word.meaning'),
            }[colName]
          }
        </span>
        <i className={`${hideAll[colName] ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash'}`}></i>
      </Button>
    </>
  )
}

export default memo(HeaderListButton)
