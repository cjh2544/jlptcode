'use client';
import React, {ChangeEvent, memo, ReactNode, useEffect, useState} from 'react';
import TabDefault from '@/app/components/Tabs/TabDefault';
import { useGrammarTodayStore } from '@/app/store/grammarTodayStore';
import { useClassTypeList, useStudyList } from '@/app/swr/useGrammarToday';
import PaidButton from '@/app/components/Buttons/PaidButton';
import ModalConfirm from '@/app/components/Modals/ModalConfirm';
import { useTranslations } from '@/app/providers/I18nProvider';

type LevelListProps = {
  level?: string,
}

const LevelList = (props: LevelListProps) => {
  const { t } = useTranslations();
  const {
    level
  } = props
  
  const grammarTodayInfo =useGrammarTodayStore((state:any) => state.grammarTodayInfo);
  const setGrammarTodayInfo = useGrammarTodayStore((state:any) => state.setGrammarTodayInfo);
  const getGrammarTodayAllList = useGrammarTodayStore((state:any) => state.getGrammarTodayAllList);
  const [confirmMsg, setConfirmMsg] = useState<ReactNode>('');
  const [isShowConfirm, setShowConfirm] = useState(false);

  const {data: levelInfos = []} = useClassTypeList({params: {level: grammarTodayInfo.level || level}});
  const {data: studyList = []} = useStudyList({params: {level: grammarTodayInfo.level || level}});

  const handleTabChange = (selectedData: any) => {
    setGrammarTodayInfo({...grammarTodayInfo, ...selectedData});
  }

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    let eObj:any = {}
    let isSearch = true;

    eObj = {[e.target.name]: e.target.value};

    if(e.target.name === 'level') {
      eObj = {...eObj, idx: levelInfos[0]?.levels.findIndex((level: string) => level === e.target.value)}
    } else if(e.target.name === 'study') {
      isSearch = false;
    }

    setGrammarTodayInfo({...grammarTodayInfo, ...eObj}, isSearch);
  }

  const handleSearch = () => {
    if (!grammarTodayInfo.study) {
      setConfirmMsg(t('common.selectStudy'));
      setShowConfirm(true);
      return;
    }
    getGrammarTodayAllList();
  }

  useEffect(() => {
    setGrammarTodayInfo({...grammarTodayInfo, level, study: ''});
  }, [level])

  return (
    <>
      <div className="px-4 mx-auto w-full m-10">
        <div className="app-panel w-full mb-6">
          <div className="app-panel-header">
            <div className="flex flex-col items-start gap-2 md:flex-row md:items-center md:justify-between md:gap-4">
                <h6 className="text-lg font-bold">{t('layout.grammarToday')}</h6>
                <strong className='app-panel-tip'>{t('speak.tipPaidOrder')}</strong>
            </div>
          </div>
          <div className="app-panel-body">
            <TabDefault onChange={handleTabChange} isUseContent={false} selectedIdx={Number(level?.substring(1,2)) - 1 || 0} data={
              (levelInfos[0]?.levels || []).map((item: any) => {
                return {
                  title: item,
                };
              })} />
            <div className="flex items-center pb-3">
              <span className="h-px flex-1 bg-gray-300"></span>
              <span className="shrink-0 px-4 text-gray-900">or</span>
              <span className="h-px flex-1 bg-gray-300"></span>
            </div>
            <div className='grid grid-cols-3 sm:grid-cols-2 items-center justify-center gap-2'>
              <select id="level" name="level" value={grammarTodayInfo.level} onChange={handleChange} className="app-select">
                {(levelInfos[0]?.levels || []).map((item: any, idx: number) => {
                  return (<option key={idx} value={item}>{item === 'N0' ? t('common.highScore') : item}</option>)
                })}
              </select>
              <select id="study" name="study" value={grammarTodayInfo.study} onChange={handleChange} className="app-select">
                <option value="">{t('common.select')}</option>
                {(studyList.find((item: any) => item.level === grammarTodayInfo.level)?.studies ?? []).map((studyNm: any, idx: number) => {
                  return (<option key={idx} value={studyNm}>{studyNm}</option>)
                })}
              </select>
              <PaidButton className="w-full sm:col-span-2" onClick={handleSearch} />
            </div>
          </div>
        </div>
      </div>
      <ModalConfirm
        type="warning"
        message={confirmMsg}
        visible={isShowConfirm}
        onClose={(visible: boolean) => setShowConfirm(visible)}
      />
    </>
  )
}

export default memo(LevelList)
