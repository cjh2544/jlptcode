'use client';
import React, {memo, useEffect} from 'react';
import { usePathname, useRouter } from 'next/navigation';
import TabDefault from '@/app/components/Tabs/TabDefault';
import { useJptStore } from '@/app/store/jptStore';
import { useClassTypeList } from '@/app/swr/useJpt';
import { sortBy } from 'lodash';
import Classification from './classification';
import Loading from '@/app/components/Loading/loading';

type JptListProps = {
  level?: string,
  onSearch?: (data: any) => any,
  onClick?: (data: any) => any,
}

const JptList = (props: JptListProps) => {
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
          <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
            <div className="rounded-t bg-white mb-0 px-6 py-6">
              <div className="text-center flex justify-between">
                  <h6 className="text-blueGray-700 text-xl font-bold">레벨업(Level up)</h6>
              </div>
            </div>
            <div className="flex-auto mt-3 lg:px-10 py-10 pt-0">
              <TabDefault onChange={handleTabChange} selectedIdx={classInfos[0]?.levelArr.findIndex((lvl:string) => lvl === jptInfo.level)} data={
                (classInfos[0]?.levelArr || []).map((item: any, idx: number) => {
                  return {
                    title: item,
                    content: (
                        <Classification classData={classInfos[0]} onClick={(data) => handleClick(data)}/>
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