'use client';
import React, {ChangeEvent, memo, ReactNode, useEffect, useState} from 'react';
import { useSpeakTodayStore } from '@/app/store/speakTodayStore';
import { useStudyList } from '@/app/swr/useSpeakToday';
import PaidButton from '@/app/components/Buttons/PaidButton';
import ModalConfirm from '@/app/components/Modals/ModalConfirm';
import { useTranslations } from '@/app/providers/I18nProvider';

const LevelList = () => {
  const { t } = useTranslations();

  const studyLevelInfoList = [
    { name: t('speak.beginner1'), level: 'N5' },
    { name: t('speak.beginner2'), level: 'N4' },
    { name: t('speak.intermediate'), level: 'N3' },
    { name: t('speak.advanced1'), level: 'N2' },
    { name: t('speak.advanced2'), level: 'N1' },
    { name: t('speak.drama'), level: 'N6' },
  ];

  const wordTodayInfo =useSpeakTodayStore((state:any) => state.wordTodayInfo);
  const setSpeakTodayInfo = useSpeakTodayStore((state:any) => state.setSpeakTodayInfo);
  const getSpeakTodayAllList = useSpeakTodayStore((state:any) => state.getSpeakTodayAllList);
  const init = useSpeakTodayStore((state:any) => state.init);
  const [confirmMsg, setConfirmMsg] = useState<ReactNode>('');
  const [isShowConfirm, setShowConfirm] = useState(false);

  const {data: studyList = []} = useStudyList({params: {level: wordTodayInfo.level}});

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    let eObj:any = {[e.target.name]: e.target.value};
    let isSearch = true;

    if(e.target.name === 'level') {
      isSearch = false;
      eObj = {...eObj, study: ''};
    } else if(e.target.name === 'study') {
      isSearch = false;
    }

    setSpeakTodayInfo({...wordTodayInfo, ...eObj}, isSearch);
  }

  const handleSearch = () => {
    if (!wordTodayInfo.study) {
      setConfirmMsg(t('common.selectStudy'));
      setShowConfirm(true);
      return;
    }
    getSpeakTodayAllList();
  }

  useEffect(() => {
    init();
  }, [])

  return (
    <>
      <div className="px-4 mx-auto w-full m-10">
        <div className="app-panel w-full mb-6">
          <div className="app-panel-header">
            <div className="flex flex-col items-start gap-2 md:flex-row md:items-center md:justify-between md:gap-4">
                <h6 className="text-lg font-bold">{t('layout.speakMaster')}</h6>
                <strong className='app-panel-tip'>{t('speak.tipMaster')}</strong>
            </div>
          </div>
          <div className="app-panel-body">
            <div className='grid grid-cols-3 sm:grid-cols-2 items-center justify-center gap-2'>
              <select id="level" name="level" value={wordTodayInfo.level} onChange={handleChange} className="app-select">
                {studyLevelInfoList.map((item: any) => {
                  return (<option key={item.level} value={item.level}>{item.name}</option>)
                })}
              </select>
              <select id="study" name="study" value={wordTodayInfo.study} onChange={handleChange} className="app-select">
                <option value="">{t('common.select')}</option>
                {(studyList.find((item: any) => item.level === wordTodayInfo.level)?.studies ?? []).map((studyNm: any, idx: number) => {
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
