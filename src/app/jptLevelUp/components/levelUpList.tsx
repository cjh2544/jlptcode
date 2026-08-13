'use client';
import React, {memo, useEffect} from 'react';
import { usePathname, useRouter } from 'next/navigation';
import TabDefault from '@/app/components/Tabs/TabDefault';
import { useJptStore } from '@/app/store/jptStore';
import { useClassTypeList } from '@/app/swr/useJpt';
import { sortBy } from 'lodash';
import Classification from './classification';
import Loading from '@/app/components/Loading/loading';
import { useTranslations } from '@/app/providers/I18nProvider';

type JptListProps = {
  level?: string,
  onSearch?: (data: any) => any,
  onClick?: (data: any) => any,
}

const JptList = (props: JptListProps) => {
  const { t } = useTranslations();
  const {
    level
  } = props
  
  const router = useRouter();
  const jptInfo =useJptStore((state:any) => state.jptInfo);
  const setJptInfo = useJptStore((state:any) => state.setJptInfo);
  const getJptRandomList = useJptStore((state:any) => state.getJptRandomList);

  const {data: classInfos = [], isLoading, error} = useClassTypeList({params: {level: jptInfo.level || level}});

  const handleClick = (selectedData: any) => {
    setJptInfo({...jptInfo, ...selectedData});
    getJptRandomList();
    router.push('/jptLevelUp/test', {scroll:false});
  }

  const handleTabChange = (selectedData: any) => {
    setJptInfo({...jptInfo, level: selectedData.level});
  }

  useEffect(() => {
    setJptInfo({...jptInfo, level: level});
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
                  <h6 className="text-lg font-bold">{t('levelUp.title')}</h6>
              </div>
            </div>
            <div className="app-panel-body">
              <TabDefault onChange={handleTabChange} selectedIdx={classInfos[0]?.levelArr.findIndex((lvl:string) => lvl === jptInfo.level)} data={
                (classInfos[0]?.levelArr || []).map((item: any, idx: number) => {
                  return {
                    title: item,
                    content: (
                        <Classification onClick={(data) => handleClick({ ...data, level: item })}/>
                    ),
                  };
                })} />
            </div>
          </div>
        </div>
      </>
    )
}

export default memo(JptList)