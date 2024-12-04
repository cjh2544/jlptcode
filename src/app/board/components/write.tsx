'use client';
import React, {memo, useEffect, useState} from 'react';
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
  const boardInfo = useBoardCommunityStore((state) => state.boardInfo);
  const pageInfo = useBoardCommunityStore((state) => state.pageInfo);
  const boardList = useBoardCommunityStore((state) => state.boardList);
  const isLoading = useBoardCommunityStore((state) => state.isLoading);
  const setPageInfo = useBoardCommunityStore((state) => state.setPageInfo);
  const getPageInfo = useBoardCommunityStore((state) => state.getPageInfo);
  const getBoardList = useBoardCommunityStore((state) => state.getBoardList);
  const init = useBoardCommunityStore((state) => state.init);

  // const {data = [], isLoading, error} = useBoardList({params: {boardInfo: boardInfo, pageInfo: pageInfo}});

  const handlePageChange = (newPageNo: number) => {
    setPageInfo({
      ...pageInfo,
      currentPage: newPageNo
    });

    getBoardList();
  }

  useEffect(() => {
    init();
    getPageInfo();
    getBoardList();
  }, [level])

  return (
    <>
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full overflow-hidden">
          문의하기1111
        </div>
      </div>
    </>
  )
}

export default memo(BoardWrite)