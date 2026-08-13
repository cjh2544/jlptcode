'use client';
import React, {memo, ReactNode, useEffect, useState} from 'react';
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

  const {data: classInfos = [], isLoading, error} = useClassTypeList({params: {level: searchInfo.level || level}});

  const handleClick = (selectedData: any) => {
    if(!session?.paymentInfo?.isValid) {
      if('test(1)' !== selectedData.test.toLowerCase()) {
        setConfirmMsg(<>{t("common.paidOnly")}<br />{t("common.paidOnlyHint")}</>);
        setShowConfirm(true);
        return;
      }
    }

    setSearchInfo({...searchInfo, ...selectedData});
    getJlptList();
    router.push('/jlptTest/test', {scroll:false});
  }

  const handleTabChange = (selectedData: any) => {
    setSearchInfo({...searchInfo, level: selectedData.level});
  }

  useEffect(() => {
    setSearchInfo({...searchInfo, level: level});
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
              <h6 className="text-lg font-bold">TEST</h6>
            </div>
          </div>
          <div className="app-panel-body">
            <TabDefault onChange={handleTabChange} selectedIdx={Number(searchInfo.level?.substring(1,2)) - 1 || 0} data={
              classInfos.map((item: any, idx: number) => {
                return {
                  title: item.level,
                  content: (
                    <Classification classData={item} onClick={(data) => handleClick(data)}/>
                  ),
                };
              })} />

              <ModalConfirm type={confirmType} message={confirmMsg} visible={isShowConfirm} onClose={(visible: boolean) => setShowConfirm(visible)} />
          </div>
        </div>
      </div>
    </>
  )
}

export default memo(JlptList)