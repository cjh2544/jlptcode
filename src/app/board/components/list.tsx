'use client';
import React, {memo, useEffect} from 'react';
import { usePathname, useRouter } from 'next/navigation';
import PaginationNew from '@/app/components/Navbars/PaginationNew';
import { useBoardCommunityStore } from '@/app/store/boardCommunityStore';
import LoadingSkeleton from '@/app/components/Loading/loadingSkeleton';
import BoardRowInfo from './boardRowInfo';
import { isEmpty } from 'lodash';
import EmptyData from '@/app/components/Alert/EmptyData';

type BoardListProps = {
  level?: string,
  onSearch?: (data: any) => any,
  onClick?: (data: any) => any,
}

const BoardList = (props: BoardListProps) => {
  const {
    level
  } = props
  
  const router = useRouter();
  const pageInfo = useBoardCommunityStore((state:any) => state.pageInfo);
  const boardList = useBoardCommunityStore((state:any) => state.boardList);
  const isLoading = useBoardCommunityStore((state:any) => state.isLoading);
  const setPageInfo = useBoardCommunityStore((state:any) => state.setPageInfo);
  const getPageInfo = useBoardCommunityStore((state:any) => state.getPageInfo);
  const getBoardList = useBoardCommunityStore((state:any) => state.getBoardList);
  const getBoardInfo = useBoardCommunityStore((state:any) => state.getBoardInfo);
  const init = useBoardCommunityStore((state:any) => state.init);

  const handlePageChange = (newPageNo: number) => {
    setPageInfo({
      ...pageInfo,
      currentPage: newPageNo
    });

    getBoardList();
  }

  const handleClickDetail = (boardInfo: Board) => {
    getBoardInfo(boardInfo)

    router.push('view', {scroll: false})
  }

  useEffect(() => {
    // init();
    getPageInfo();
    getBoardList();
  }, [])

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
                    isEmpty(boardList) ? (
                      <>
                        <tr>
                          <td colSpan={3}>
                            <EmptyData />
                          </td>
                        </tr>
                      </>
                    ) : boardList.map((boardInfo: Board, idx: number) => {
                      return (
                        <BoardRowInfo 
                          key={idx} 
                          onClickDetail={handleClickDetail} 
                          boardInfo={boardInfo} />
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