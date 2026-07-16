'use client';
import React, {ChangeEvent, memo, MouseEvent, useEffect} from 'react';
import TabDefault from '@/app/components/Tabs/TabDefault';
import { useSpeakTodayStore } from '@/app/store/speakTodayStore';
import { useClassTypeList, useStudyList } from '@/app/swr/useSpeakToday';
import PaidButton from '@/app/components/Buttons/PaidButton';
import { useTranslations } from '@/app/providers/I18nProvider';

type LevelListProps = {
  levels?: string,
  level?: string,
  idx?: number,
  onSearch?: (data: any) => any,
  onClick?: (data: any) => any,
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
  const getSpeakTodayAllList = useSpeakTodayStore((state:any) => state.getSpeakTodayAllList);

  const {data: studyList = [], isLoading, error} = useStudyList({params: {level: wordTodayInfo.level}});

  const handleTabChange = (selectedData: any) => {

    setSpeakTodayInfo({...wordTodayInfo, ...selectedData, levels: selectedData.level.split(','), level: wordTodayInfo.level});
  }

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    let eObj:any = {}
    let isSearch = true;

    eObj = {[e.target.name]: e.target.value};

    if(e.target.name === 'level') {
      isSearch = false;
      eObj = {...eObj, study: ''};
    } else if(e.target.name === 'study') {
      isSearch = false;
    }

    setSpeakTodayInfo({...wordTodayInfo, ...eObj}, isSearch);
  }

  const handleSearch = (e: MouseEvent<HTMLElement>) => {
    getSpeakTodayAllList();
  }

  useEffect(() => {
    setSpeakTodayInfo({...wordTodayInfo, level: wordTodayInfo.level, levels: levels.split(','), study: '', idx});
  }, [])

  return (
    <>
      <div className="px-4 mx-auto w-full m-10">
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
          <div className="rounded-t bg-white mb-0 px-6 py-6">
            <div className="text-center flex justify-between">
                <h6 className="text-blueGray-700 text-xl font-bold">{t('sidebar.speakConversation')}</h6>
                <strong className='text-red-700'>{t('speak.tipPaid')}</strong>
            </div>
          </div>
          <div className="flex-auto lg:px-10 p-4">
            <TabDefault onChange={handleTabChange} isUseContent={false} selectedIdx={idx} data={
              levelInfoList.map((item: any, idx: number) => {
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
