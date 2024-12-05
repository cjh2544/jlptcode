'use client';
import React, {FormEvent, memo, useCallback, useEffect, useState} from 'react';
import { usePathname, useRouter } from 'next/navigation';
import TabDefault from '@/app/components/Tabs/TabDefault';
import { useJlptStore } from '@/app/store/jlptStore';
import { useClassTypeList } from '@/app/swr/useJlpt';
import Loading from '@/app/components/Loading/loading';
import PaginationNew from '@/app/components/Navbars/PaginationNew';
import { useBoardCommunityStore } from '@/app/store/boardCommunityStore';
import { useBoardList } from '@/app/swr/useBoardCommunity';
import { format } from "date-fns";
import { init } from 'next/dist/compiled/webpack/webpack';
import LoadingSkeleton from '@/app/components/Loading/loadingSkeleton';
import { find, includes, isEmpty } from 'lodash';
import Link from 'next/link';
import { z } from 'zod';
import ModalConfirm from '@/app/components/Modals/ModalConfirm';

type BoardWriteProps = {
  level?: string,
  onSearch?: (data: any) => any,
  onClick?: (data: any) => any,
}

const BoardWrite = (props: BoardWriteProps) => {
  const {
    level
  } = props
  
  const pathname = usePathname();
  const router = useRouter();
  const isLoading = useBoardCommunityStore((state) => state.isLoading);
  const errors = useBoardCommunityStore((state) => state.errors);
  const showConfirm = useBoardCommunityStore((state) => state.showConfirm);
  const confirmMsg = useBoardCommunityStore((state) => state.confirmMsg);
  const messageType = useBoardCommunityStore((state) => state.messageType);
  const success = useBoardCommunityStore((state) => state.success);
  const setLoading = useBoardCommunityStore((state) => state.setLoading);
  const setBoardInfo = useBoardCommunityStore((state) => state.setBoardInfo);
  const setErrors = useBoardCommunityStore((state) => state.setErrors);
  const setShowConfirm = useBoardCommunityStore((state) => state.setShowConfirm);
  const setConfirmMsg = useBoardCommunityStore((state) => state.setConfirmMsg);
  const setSuccess = useBoardCommunityStore((state) => state.setSuccess);
  const setMessageType = useBoardCommunityStore((state) => state.setMessageType);

  // const {data = [], isLoading, error} = useBoardList({params: {boardInfo: boardInfo, pageInfo: pageInfo}});

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true)
    setErrors(null)
 
    try {
      const formData = new FormData(event.currentTarget);
      
      const response = await fetch('/api/board/community', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json();
      
      if(data.success) {
        setBoardInfo(Object.fromEntries(formData));
        setMessageType('info');
        setConfirmMsg(data.message);
        setShowConfirm(true);
        setSuccess(true);
      } else {
        if(data.error) {
          setMessageType('error');
          setErrors(data.error.issues);
        } else {
          setMessageType('warning');
          setConfirmMsg(data.message);
          setShowConfirm(true);
        }
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        setMessageType('error');
        setConfirmMsg(error.message);
      }
    } finally {
      setLoading(false)
    }
  }

  const getErrorMessage = useCallback((colName: string) => {
    if(isEmpty(errors)) {
      return '';
    } else {
      const result = find(errors, (err) => includes(err.path, colName));
      return result?.message;
    }
  }, [errors]);

  const isValid = useCallback((colName: string) => {
    if(isEmpty(errors)) {
      return true;
    } else {
      const result = find(errors, (err) => includes(err.path, colName));
      return isEmpty(result);
    }
  }, [errors])

  const handleCloseModal = (visible: boolean) => {
    setShowConfirm(visible);

    if(success) {
      router.push('list', {scroll: false})
    }
  }

  return (
    <>
      <div className="font-nanumGothic flex flex-col items-center justify-center px-6 py-8 lg:py-0">
          <div className="w-full bg-white rounded-lg shadow-lg">
              <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                  <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                      문의내용 수정
                  </h1>
                  <form onSubmit={onSubmit} className="space-y-4 md:space-y-6">
                      <div>
                          <label className={`block mb-2 text-sm font-bold ${isValid('title') ? 'text-gray-900' : 'text-red-600'} dark:text-white`}>제목 (2~100자리)</label>
                          <input required={true} maxLength={100} type="text" name="title" id="title" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="제목 입력" />
                          <p className={`${isValid('title') ? 'hidden' : 'text-red-600 text-sm'}`}>{getErrorMessage('title')}</p>
                      </div>
                      <div>
                          <label className={`block mb-2 text-sm font-bold ${isValid('contents') ? 'text-gray-900' : 'text-red-600'} dark:text-white`}>내용 (2~5000자리)</label>
                          <textarea name="contents" id="contents"
                            required={true} 
                            maxLength={5000}
                            rows={10}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                            placeholder="내용 입력">
                          </textarea>
                          <p className={`${isValid('contents') ? 'hidden' : 'text-red-600 text-sm'}`}>{getErrorMessage('contents')}</p>
                      </div>
                      <div className='flex justify-center gap-2'>
                        {isLoading ? (
                          <>
                            <button disabled type="submit" className="cursor-not-allowed w-1/2 bg-blue-300 text-white font-bold py-2 px-4 rounded focus:outline-none">
                              <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                              </svg>
                              처리중...
                            </button>
                          </>
                        ) : (
                          <>
                            <button type="submit" className="w-1/2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none">
                              문의하기
                            </button>
                          </>
                        )}
                        <Link href="list" scroll={false} className="w-1/2 text-center text-gray-900 bg-white border border-gray-400 font-bold py-2 px-4 rounded">
                          취소
                        </Link>
                      </div>
                  </form>
              </div>
          </div>
      </div>
      <ModalConfirm type={messageType} message={confirmMsg} visible={showConfirm} onClose={(visible: boolean) => handleCloseModal(visible)} />
    </>
  )
}

export default memo(BoardWrite)