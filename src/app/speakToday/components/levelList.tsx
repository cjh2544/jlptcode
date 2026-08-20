'use client';
import React, {memo, useEffect} from 'react';
import TabDefault from '@/app/components/Tabs/TabDefault';
import { useSpeakTodayStore } from '@/app/store/speakTodayStore';
import { useTranslations } from '@/app/providers/I18nProvider';

type LevelListProps = {
  levels?: string,
  idx?: number,
}

const LevelList = (props: LevelListProps) => {
  const { t } = useTranslations();
  const {
    levels = 'N5', idx = 0
  } = props

  const levelInfoList = [
    { name: t('speak.beginner'), levels: ['N5'] },
    { name: t('speak.intermediate'), levels: ['N3', 'N4'] },
    { name: t('speak.advanced'), levels: ['N1', 'N2'] },
    { name: t('speak.drama'), levels: ['N6'] },
    { name: 'TOTAL', levels: ['N1', 'N2', 'N3', 'N4', 'N5', 'N6'] },
  ];

  const wordTodayInfo =useSpeakTodayStore((state:any) => state.wordTodayInfo);
  const setSpeakTodayInfo = useSpeakTodayStore((state:any) => state.setSpeakTodayInfo);

  const handleTabChange = (selectedData: any) => {
    setSpeakTodayInfo({...wordTodayInfo, ...selectedData, levels: selectedData.level.split(','), level: wordTodayInfo.level});
  }

  useEffect(() => {
    setSpeakTodayInfo({...wordTodayInfo, level: wordTodayInfo.level, levels: levels.split(','), study: '', idx});
  }, [])

  return (
    <>
      <div className="px-4 mx-auto w-full m-10">
        <div className="app-panel w-full mb-6">
          <div className="app-panel-header">
            <div className="flex flex-col items-start gap-2 md:flex-row md:items-center md:justify-between md:gap-4">
                <h6 className="text-lg font-bold">{t('sidebar.speakConversation')}</h6>
                <strong className='app-panel-tip'>{t('speak.tipPaidOrder')}</strong>
            </div>
          </div>
          <div className="app-panel-body">
            <TabDefault onChange={handleTabChange} isUseContent={false} selectedIdx={idx} data={
              levelInfoList.map((item: any) => {
                return {
                  title: item.levels.toString(),
                  displayName: item.name,
                };
              })
            }/>
          </div>
        </div>
      </div>
    </>
  )
}

export default memo(LevelList)
