'use client';
import React, {memo, ReactNode, useEffect, useMemo, useState} from 'react';
import { useRouter } from 'next/navigation';
import TabDefault from '@/app/components/Tabs/TabDefault';
import { useJlptTestStore } from '@/app/store/jlptTestStore';
import { useClassTypeList } from '@/app/swr/useJlptTest';
import Classification from './classification';
import Loading from '@/app/components/Loading/loading';
import ModalConfirm from '@/app/components/Modals/ModalConfirm';
import { useSession } from "next-auth/react";
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

  const { data: session } = useSession();
  
  const [confirmMsg, setConfirmMsg] = useState<ReactNode>('')
  const [confirmType, setConfirmType] = useState<any>('info')
  const [isShowConfirm, setShowConfirm] = useState<boolean>(false)
  const router = useRouter();
  const searchInfo =useJlptTestStore((state:any) => state.searchInfo);
  const setSearchInfo = useJlptTestStore((state:any) => state.setSearchInfo);
  const getJlptList = useJlptTestStore((state:any) => state.getJlptList);

  const currentLevel = searchInfo.level || level || 'N1';
  // 탭용으로 전체 레벨 메타를 받고, 과목/회차는 선택 레벨 데이터만 표시
  const {data: classInfos = [], isLoading} = useClassTypeList({params: {}});

  const selectedClassData = useMemo(
    () => classInfos.find((item: any) => item.level === currentLevel) ?? null,
    [classInfos, currentLevel],
  );

  const selectedIdx = useMemo(() => {
    const idx = classInfos.findIndex((item: any) => item.level === currentLevel);
    return idx >= 0 ? idx : 0;
  }, [classInfos, currentLevel]);

  const handleClick = (selectedData: any) => {
    if(!session?.paymentInfo?.isValid) {
      if('test(1)' !== selectedData.test.toLowerCase()) {
        setConfirmMsg(<>{t("common.paidOnly")}<br />{t("common.paidOnlyHint")}</>);
        setShowConfirm(true);
        return;
      }
    }

    const nextSearchInfo = {
      ...searchInfo,
      ...selectedData,
      level: currentLevel,
    };
    setSearchInfo(nextSearchInfo);
    getJlptList(nextSearchInfo);
    router.push('/jlptTest/test', {scroll:false});
  }

  const handleTabChange = (selectedData: any) => {
    const nextLevel = selectedData.level;
    setSearchInfo({
      ...useJlptTestStore.getState().searchInfo,
      level: nextLevel,
      classification: '',
      test: '',
    });
    router.replace(`/jlptTest?level=${nextLevel}`, { scroll: false });
  }

  useEffect(() => {
    if (!level) return;
    const prev = useJlptTestStore.getState().searchInfo;
    if (prev.level === level) return;
    setSearchInfo({ ...prev, level });
  }, [level, setSearchInfo])

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
              <h6 className="text-lg font-bold">TEST</h6>
            </div>
          </div>
          <div className="app-panel-body">
            <TabDefault
              onChange={handleTabChange}
              isUseContent={false}
              selectedIdx={selectedIdx}
              data={classInfos.map((item: any) => ({
                title: item.level,
              }))}
            />
            {selectedClassData ? (
              <Classification
                classData={selectedClassData}
                onClick={(data) => handleClick(data)}
              />
            ) : null}

              <ModalConfirm type={confirmType} message={confirmMsg} visible={isShowConfirm} onClose={(visible: boolean) => setShowConfirm(visible)} />
          </div>
        </div>
      </div>
    </>
  )
}

export default memo(JlptList)
