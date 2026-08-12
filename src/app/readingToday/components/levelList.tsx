'use client';
import React, {memo, useEffect} from 'react';
import TabDefault from '@/app/components/Tabs/TabDefault';
import { useReadingTodayStore } from '@/app/store/readingTodayStore';
import { useClassTypeList } from '@/app/swr/useReadingToday';
import Loading from '@/app/components/Loading/loading';
import { useTranslations } from '@/app/providers/I18nProvider';

type LevelListProps = {
  level?: string,
  idx?: number,
  onSearch?: (data: any) => any,
  onClick?: (data: any) => any,
}

const LevelList = (props: LevelListProps) => {
  const { t } = useTranslations();
  const {
    level,
    idx = 0,
  } = props
  
  const readingTodayInfo =useReadingTodayStore((state:any) => state.readingTodayInfo);
  const readingTodayList =useReadingTodayStore((state:any) => state.readingTodayList);
  const setReadingTodayInfo = useReadingTodayStore((state:any) => state.setReadingTodayInfo);
  const setReadingTodayList = useReadingTodayStore((state:any) => state.setReadingTodayList);

  const {data: levelInfos = [], isLoading, error} = useClassTypeList({ params: {} });

  const handleTabChange = (selectedData: any) => {
    setReadingTodayInfo({...readingTodayInfo, ...selectedData});
    setReadingTodayList(
      readingTodayList.map((item: any, idx: number) => ({
        ...item, 
        hideSentence: false,
        hideSentenceRead: true,
        hideSentenceTranslate: true
      }))
    );
  }

  useEffect(() => {
    setReadingTodayInfo({...readingTodayInfo, level, idx});
  }, [])

  return (
    <>
      <div className="px-4 mx-auto w-full m-10">
        <div className="app-panel w-full mb-6">
          <div className="app-panel-header">
            <div className="flex justify-between items-center gap-4">
                <h6 className="text-lg font-bold">{t('layout.readingToday')}</h6>
                <strong></strong>
            </div>
          </div>
          <div className="flex-auto lg:px-10 py-4">
            {isLoading ? (
              <Loading />
            ) : (
              <TabDefault onChange={handleTabChange} isUseContent={false} selectedIdx={readingTodayInfo.idx} data={
                (levelInfos[0]?.levels || []).map((item: any, idx: number) => {
                  return {
                    title: item,
                    displayName: item === 'N0' ? t('speak.advanced') : item
                  };
                })} />
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default memo(LevelList)
