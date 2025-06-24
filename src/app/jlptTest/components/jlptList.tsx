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

type JlptListProps = {
  level?: string,
  onSearch?: (data: any) => any,
  onClick?: (data: any) => any,
}

const JlptList = (props: JlptListProps) => {
  const {
    level
  } = props

  const { data: session } = useSession();
  
  const [confirmMsg, setConfirmMsg] = useState<ReactNode>('')
  const [confirmType, setConfirmType] = useState<any>('info')
  const [isShowConfirm, setShowConfirm] = useState<boolean>(false)
  const router = useRouter();
  const searchInfo =useJlptTestStore((state) => state.searchInfo);
  const setSearchInfo = useJlptTestStore((state) => state.setSearchInfo);
  const getJlptList = useJlptTestStore((state) => state.getJlptList);

  const {data: classInfos = [], isLoading, error} = useClassTypeList({params: {level: searchInfo.level || level}});

  const handleClick = (selectedData: any) => {
    if(!session?.paymentInfo?.isValid) {
      if('test(1)' !== selectedData.test.toLowerCase()) {
        setConfirmMsg(<>유료회원만이 이용가능합니다.<br />문의게시판에 “유료회원안내”을 확인해 주세요.</>);
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
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
          <div className="rounded-t bg-white mb-0 px-6 py-6">
            <div className="text-center flex justify-between">
              <h6 className="text-blueGray-700 text-xl font-bold">TEST</h6>
            </div>
          </div>
          <div className="flex-auto mt-3 lg:px-10 py-10 pt-0">
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