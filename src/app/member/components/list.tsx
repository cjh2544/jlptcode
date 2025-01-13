'use client';
import React, {memo, useEffect} from 'react';
import { usePathname, useRouter } from 'next/navigation';
import PaginationNew from '@/app/components/Navbars/PaginationNew';
import { useUserStore } from '@/app/store/userStore';
import LoadingSkeleton from '@/app/components/Loading/loadingSkeleton';
import MemberRowInfo from './memberRowInfo';
import { isEmpty } from 'lodash';
import EmptyData from '@/app/components/Alert/EmptyData';

type BoardListProps = {
  level?: string,
  onSearch?: (data: any) => any,
  onClick?: (data: any) => any,
}

const MmeberList = (props: BoardListProps) => {
  const {
    level
  } = props
  
  const router = useRouter();
  const pageInfo = useUserStore((state) => state.pageInfo);
  const userList = useUserStore((state) => state.userList);
  const isLoading = useUserStore((state) => state.isLoading);
  const setPageInfo = useUserStore((state) => state.setPageInfo);
  const getPageInfo = useUserStore((state) => state.getPageInfo);
  const getUserList = useUserStore((state) => state.getUserList);
  const getUserInfo = useUserStore((state) => state.getUserInfo);
  const init = useUserStore((state) => state.init);

  const handlePageChange = (newPageNo: number) => {
    setPageInfo({
      ...pageInfo,
      currentPage: newPageNo
    });

    getUserList();
  }

  const handleClickDetail = (userInfo: User) => {
    getUserInfo(userInfo)

    router.push('view', {scroll: false})
  }

  useEffect(() => {
    // init();
    getPageInfo();
    getUserList();
  }, [])

  return (
    <>
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full overflow-hidden">
          <table className="min-w-full leading-normal mb-4">
            <thead>
                <tr>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        이름
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        이메일
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
                    isEmpty(userList) ? (
                      <>
                        <tr>
                          <td colSpan={3}>
                            <EmptyData />
                          </td>
                        </tr>
                      </>
                    ) : userList.map((userInfo: User, idx: number) => {
                      return (
                        <MemberRowInfo 
                          key={idx} 
                          userInfo={userInfo} />
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

export default memo(MmeberList)