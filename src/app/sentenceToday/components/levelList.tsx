'use client';
import React, {ChangeEvent, memo, ReactNode, useEffect, useState} from 'react';
import TabDefault from '@/app/components/Tabs/TabDefault';
import { useSentenceTodayStore } from '@/app/store/sentenceTodayStore';
import { useClassTypeList } from '@/app/swr/useSentenceToday';
import Loading from '@/app/components/Loading/loading';
import { useStudyList } from '@/app/swr/useWordToday';
import PaidButton from '@/app/components/Buttons/PaidButton';
import ModalConfirm from '@/app/components/Modals/ModalConfirm';
import { useTranslations } from '@/app/providers/I18nProvider';

type LevelListProps = {
  level?: string,
  idx?: number,
}

const LevelList = (props: LevelListProps) => {
  const { t } = useTranslations();
  const {
    level,
    idx = 0,
  } = props
  
  const wordTodayInfo =useSentenceTodayStore((state:any) => state.wordTodayInfo);
  const setWordTodayInfo = useSentenceTodayStore((state:any) => state.setWordTodayInfo);
  const getWordTodayAllList = useSentenceTodayStore((state:any) => state.getWordTodayAllList);
  const [confirmMsg, setConfirmMsg] = useState<ReactNode>('');
  const [isShowConfirm, setShowConfirm] = useState(false);

  const {data: levelInfos = [], isLoading} = useClassTypeList({params: {ignoreLevels: ['N0', 'N6']}});
  const {data: studyList = []} = useStudyList({params: {ignoreLevels: ['N0', 'N6']}});

  const handleTabChange = (selectedData: any) => {
    setWordTodayInfo({...wordTodayInfo, ...selectedData});
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

    setWordTodayInfo({...wordTodayInfo, ...eObj}, isSearch);
  }

  const handleSearch = () => {
    if (!wordTodayInfo.study) {
      setConfirmMsg(t('common.selectStudy'));
      setShowConfirm(true);
      return;
    }
    getWordTodayAllList();
  }

  useEffect(() => {
    setWordTodayInfo({...wordTodayInfo, level, study: '', idx});
  }, [level])

  return (
    <>
      <div className="px-4 mx-auto w-full m-10">
        <div className="app-panel w-full mb-6">
          <div className="app-panel-header">
            <div className="flex flex-col items-start gap-2 md:flex-row md:items-center md:justify-between md:gap-4">
                <h6 className="text-lg font-bold">{t('layout.sentenceToday')}</h6>
                <strong className='app-panel-tip'>{t('today.tipPaidOrder')}</strong>
            </div>
          </div>
          <div className="app-panel-body">
            {isLoading ? (
              <Loading />
            ) : (
              <>
                <TabDefault onChange={handleTabChange} isUseContent={false} selectedIdx={wordTodayInfo.idx} data={
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
                  <select id="level" name="level" value={wordTodayInfo.level} onChange={handleChange} className="app-select">
                    {(levelInfos[0]?.levels || []).map((item: any, idx: number) => {
                      return (<option key={idx} value={item}>{item === 'N0' ? t('common.highScore') : item}</option>)
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
              </>
            )}
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
