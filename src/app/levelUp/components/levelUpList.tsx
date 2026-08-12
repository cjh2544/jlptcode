'use client';
import React, {memo, useEffect} from 'react';
import { usePathname, useRouter } from 'next/navigation';
import TabDefault from '@/app/components/Tabs/TabDefault';
import { useLevelUpStore } from '@/app/store/levelUpStore';
import { useClassTypeList } from '@/app/swr/useLevelUp';
import { sortBy } from 'lodash';
import Classification from './classification';
import Loading from '@/app/components/Loading/loading';
import { useTranslations } from '@/app/providers/I18nProvider';

type LevelUpListProps = {
  level?: string,
  onSearch?: (data: any) => any,
  onClick?: (data: any) => any,
}

const LevelUpList = (props: LevelUpListProps) => {
  const { t } = useTranslations();
  const {
    level
  } = props
  
  const router = useRouter();
  const levelUpInfo =useLevelUpStore((state:any) => state.levelUpInfo);
  const setLevelUpInfo = useLevelUpStore((state:any) => state.setLevelUpInfo);
  const getLevelUpList = useLevelUpStore((state:any) => state.getLevelUpList);

  const {data: classInfos = [], isLoading, error} = useClassTypeList({params: {level: levelUpInfo.level || level}});

  const handleClick = (selectedData: any) => {
    setLevelUpInfo({...levelUpInfo, ...selectedData});
    getLevelUpList();
    router.push('/levelUp/test', {scroll:false});
  }

  const handleTabChange = (selectedData: any) => {
    setLevelUpInfo({...levelUpInfo, level: selectedData.level});
  }

  useEffect(() => {
    setLevelUpInfo({...levelUpInfo, level: level});
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
              <div className="flex justify-between items-center gap-4">
                  <h6 className="text-lg font-bold">{t('levelUp.title')}</h6>
                  <strong className="app-panel-tip">{t('levelUp.tip')}</strong>
              </div>
            </div>
            <div className="app-panel-body">
              <TabDefault onChange={handleTabChange} selectedIdx={Number(levelUpInfo.level?.substring(1,2)) - 1 || 0} data={
                sortBy(classInfos[0]?.levelArr).map((item, idx) => {
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

export default memo(LevelUpList)