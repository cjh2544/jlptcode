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
  id?: string,
}

const BoardView = (props: BoardWriteProps) => {
  const {
    id
  } = props
  
  const pathname = usePathname();
  const router = useRouter();
  const boardInfo: Board = useBoardCommunityStore((state) => state.boardInfo);

  // const {data = [], isLoading, error} = useBoardList({params: {boardInfo: boardInfo, pageInfo: pageInfo}});

  return (
    <>
      <div className="font-nanumGothic flex flex-col items-center justify-center px-6 py-8 lg:py-0">
          <div className="w-full bg-white rounded-lg shadow-lg">
              <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                  <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                      문의내용 상세
                  </h1>
                  <form className="space-y-4 md:space-y-6">
                      <div>
                          <label className={`block mb-2 text-sm font-bold text-gray-900`}>제목 (2~100자리)</label>
                          <input value={boardInfo.title || ''} disabled maxLength={100} type="text" name="title" id="title" className="bg-gray-500 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="제목 입력" />
                      </div>
                      <div>
                          <label className={`block mb-2 text-sm font-bold text-gray-900`}>내용 (2~5000자리)</label>
                          <textarea value={boardInfo.contents || ''} name="contents" id="contents"
                            disabled={true} 
                            maxLength={5000}
                            rows={10}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                            placeholder="내용 입력">
                          </textarea>
                      </div>
                      <div className='flex justify-center gap-2'>
                        <Link href="modify" scroll={false} className="w-1/2 text-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none">
                          수정
                        </Link>
                        <Link href="list" scroll={false} className="w-1/2 text-center text-gray-900 bg-white border border-gray-400 font-bold py-2 px-4 rounded">
                          확인
                        </Link>
                      </div>
                  </form>
              </div>
          </div>
      </div>
    </>
  )
}

export default memo(BoardView)