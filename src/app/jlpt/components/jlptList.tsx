'use client';
import React, {memo, useEffect} from 'react';
import { useRouter } from 'next/navigation';
import TabDefault from '@/app/components/Tabs/TabDefault';
import { useJlptStore } from '@/app/store/jlptStore';
import { useClassTypeList } from '@/app/swr/useJlpt';
import Classification from './classification';
import Loading from '@/app/components/Loading/loading';
import { useTranslations } from '@/app/providers/I18nProvider';

type JlptListProps = {
  level?: string,
  onSearch?: (data: any) => any,
  onClick?: (data: any) => any,
}

const JlptList = (props: JlptListProps) => {
  const { t } = useTranslations();
  const {
    level
  } = props
  
  const router = useRouter();
  const searchInfo =useJlptStore((state:any) => state.searchInfo);
  const setSearchInfo = useJlptStore((state:any) => state.setSearchInfo);
  const getJlptList = useJlptStore((state:any) => state.getJlptList);

  const {data: classInfos = [], isLoading, error} = useClassTypeList({params: {level: searchInfo.level || level}});

  const handleClick = (selectedData: any) => {
    setSearchInfo({...searchInfo, ...selectedData});
    getJlptList();
    router.push('/jlpt/test', {scroll:false});
  }

  const handleTabChange = (selectedData: any) => {
    setSearchInfo({...searchInfo, level: selectedData.level});
  }

  useEffect(() => {
    setSearchInfo({...searchInfo, level: level});
  }, [level])

  return isLoading ?
    (
      <>
        <Loading />
      </>
    ) : (
    <>
      <div className="px-4 mx-auto w-full m-10 mb-12">
        <div className="app-panel w-full mb-6">
          <div className="app-panel-header">
            <div className="flex flex-col items-start gap-2 md:flex-row md:items-center md:justify-between md:gap-4">
              <h6 className="text-lg font-bold">{t('layout.jlpt')}</h6>
            </div>
          </div>
          <div className="app-panel-body">
            <TabDefault onChange={handleTabChange} selectedIdx={Number(searchInfo.level?.substring(1,2)) - 1 || 0} data={
              classInfos.map((item: any, idx: number) => {
                return {
                  title: item.level,
                  content: (
                    <Classification classData={item} onClick={(data) => handleClick(data)}/>
                  ),
                };
              })} />
          </div>
        </div>
      </div>
    </>
  )
}

export default memo(JlptList)