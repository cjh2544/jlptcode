'use client';
import React, {ChangeEvent, memo, MouseEvent, useEffect} from 'react';
import TabDefault from '@/app/components/Tabs/TabDefault';
import { useSpeakTodayStore } from '@/app/store/speakTodayStore';
import { useClassTypeList, useStudyList } from '@/app/swr/useSpeakToday';
import { useTranslations } from '@/app/providers/I18nProvider';
import { Button } from '@/components/ui/button';

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
  const getSpeakTodayList = useSpeakTodayStore((state:any) => state.getSpeakTodayList);
  const hideAll = useSpeakTodayStore((state:any) => state.hideAll);
  const setHideAllInfo = useSpeakTodayStore(state => state.setHideAllInfo);

  const handleClickHeader = (colName: string) => {
    setHideAllInfo({...hideAll, [colName]: !hideAll[colName]});
  }

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    let eObj:any = {}
    let isSearch = true;

    
    if(e.target.name === 'levels') {
      isSearch = false;
      eObj = {[e.target.name]: e.target.value.split(',')};
    } else if(e.target.name === 'study') {
      isSearch = false;
    }

    setSpeakTodayInfo({...wordTodayInfo, ...eObj}, isSearch);
  }

  const handleSearch = (e: MouseEvent<HTMLElement>) => {
    getSpeakTodayList();
  }

  useEffect(() => {
    setSpeakTodayInfo({...wordTodayInfo, level: wordTodayInfo.level, levels: levels.split(','), study: '', idx});
  }, [])

  return (
    <>
      <div className="px-4 mx-auto w-full m-10 sticky top-0">
        <div className="app-panel w-full mb-6">
          <div className="app-panel-header">
            <div className="flex justify-between items-center gap-4">
                <h6 className="text-lg font-bold">{t('layout.speakTest')}</h6>
                <strong className='app-panel-tip'>{t('speak.tipPaid')}</strong>
            </div>
          </div>
          <div className="flex justify-between lg:px-10 p-4">
            <div className='flex gap-2'>
              <select id="levels" name="levels" value={setSpeakTodayInfo.levels} onChange={handleChange} className="app-select">
                  {levelInfoList.map((item: any, idx: number) => {
                    return (<option key={idx} value={item.levels.toString()}>{item.name}</option>)
                  })}
              </select>
              <Button
                type="button"
                size="lg"
                className="h-10 gap-2 font-semibold uppercase tracking-wide"
                onClick={handleSearch}
              >
                <i className="fas fa-search" aria-hidden />
                {t('common.query')}
              </Button>
              <Button
                type="button"
                size="lg"
                variant="secondary"
                className="h-10 gap-2 font-semibold uppercase tracking-wide"
                onClick={handleSearch}
              >
                <i className="fas fa-play" aria-hidden />
                {t('common.start')}
              </Button>
            </div>
            <div className='flex'>
              <div className="flex items-center mr-1">
                <input id="show-speak-checkbox" type="checkbox" checked={!hideAll.speak} onChange={() => handleClickHeader('speak')} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2" />
                <label htmlFor="show-speak-checkbox" className="ms-2 text-sm font-medium text-gray-900">{t('common.pronunciation')}</label>
              </div>
              <div className="flex items-center mr-1">
                <input id="show-keyword-checkbox" type="checkbox" checked={!hideAll.keyword} onChange={() => handleClickHeader('keyword')} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2" />
                <label htmlFor="show-keyword-checkbox" className="ms-2 text-sm font-medium text-gray-900">{t('common.keyword')}</label>
              </div>
              <div className="flex items-center mr-1">
                <input id="show-sentence-checkbox" type="checkbox" checked={!hideAll.sentence} onChange={() => handleClickHeader('sentence')} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2" />
                <label htmlFor="show-sentence-checkbox" className="ms-2 text-sm font-medium text-gray-900">{t('common.sentence')}</label>
              </div>
              <div className="flex items-center mr-1">
                <input id="show-sentenceread-checkbox" type="checkbox" checked={!hideAll.sentence_read} onChange={() => handleClickHeader('sentence_read')} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2" />
                <label htmlFor="show-sentenceread-checkbox" className="ms-2 text-sm font-medium text-gray-900">{t('common.read')}</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default memo(LevelList)
