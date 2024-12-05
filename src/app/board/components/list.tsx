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

type BoardListProps = {
  level?: string,
  onSearch?: (data: any) => any,
  onClick?: (data: any) => any,
}

const BoardList = (props: BoardListProps) => {
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
  const setBoardInfo = useBoardCommunityStore((state) => state.setBoardInfo);
  const getBoardInfo = useBoardCommunityStore((state) => state.getBoardInfo);
  const init = useBoardCommunityStore((state) => state.init);

  // const {data = [], isLoading, error} = useBoardList({params: {boardInfo: boardInfo, pageInfo: pageInfo}});

  const handlePageChange = (newPageNo: number) => {
    setPageInfo({
      ...pageInfo,
      currentPage: newPageNo
    });

    getBoardList();
  }

  const handleClickDetail = (id: string) => {
    setBoardInfo({id});
    getBoardInfo()

    router.push('view', {scroll: false})
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
          <table className="min-w-full leading-normal mb-4">
            <thead>
                <tr>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        제목
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        작성자
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        등록일자
                    </th>
                </tr>
            </thead>
            <tbody>
                {
                  isLoading ? 
                  (
                    <>
                      <tr>
                        <td colSpan={3}>
                          <LoadingSkeleton />
                        </td>
                      </tr>
                    </>
                  ) : (
                    boardList.map((boardInfo: Board, idx: number) => {
                      return (
                        <tr key={`board-community-${idx}`} onClick={() => handleClickDetail(boardInfo._id)} className='cursor-pointer hover:font-bold'>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                <p className="text-gray-900 whitespace-no-wrap">
                                    {boardInfo.title}
                                </p>
                            </td>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                <p className="text-gray-900 whitespace-no-wrap">
                                    {boardInfo.name}
                                </p>
                            </td>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                <p className="text-gray-900 whitespace-no-wrap">
                                    {format(boardInfo.createdAt, 'yyyy-MM-dd HH:mm:ss')}
                                </p>
                            </td>
                        </tr>
                      )
                    })
                  )
                }
            </tbody>
        </table>
        <PaginationNew pageInfo={pageInfo} onPageChange={(newPage: number) => handlePageChange(newPage)} />
      </div>
    </div>
  </>
  )
}

export default memo(BoardList)