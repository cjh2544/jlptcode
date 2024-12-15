'use client';
import React, {memo, MouseEvent, useCallback} from 'react';
import { useBoardCommunityStore } from '@/app/store/boardCommunityStore';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

type BoardWriteProps = {
  id?: string,
}

const BoardView = (props: BoardWriteProps) => {
  const {
    id
  } = props
  
  const { data: session } = useSession();
  const boardInfo: Board = useBoardCommunityStore((state) => state.boardInfo);

  const handleLinkActive = (event: MouseEvent<HTMLAnchorElement>) => {
    if (session?.user?.email !== boardInfo.email) event.preventDefault();
  };

  const isMyWrite = useCallback(() => {
    return session?.user?.email && session?.user?.email === boardInfo.email;
  }, [boardInfo, session])

  const isAdmin = useCallback(() => {
    return session?.user?.role && session?.user?.role?.includes('admin');
  }, [boardInfo, session])

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
                          <input defaultValue={boardInfo.title || ''} disabled={true} maxLength={100} type="text" name="title" id="title" className="bg-gray-100 border border-gray-300 text-gray-900 rounded-lg focus:outline-none block w-full p-2.5" placeholder="제목 입력" />
                      </div>
                      <div>
                          <label className={`block mb-2 text-sm font-bold text-gray-900`}>내용 (2~5000자리)</label>
                          <textarea defaultValue={boardInfo.contents || ''} name="contents" id="contents"
                            disabled={true} 
                            maxLength={5000}
                            rows={10}
                            className="bg-gray-100 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                            placeholder="내용 입력">
                          </textarea>
                      </div>
                      <div className='flex justify-center gap-2'>
                        {isAdmin() && (
                          <Link href="reply" scroll={false} className={`hover:bg-green-700 text-center bg-green-500 text-white font-bold py-2 px-4 rounded focus:outline-none`}>
                            답변하기
                          </Link>
                        )}
                        {isMyWrite() && (
                          <Link onClick={handleLinkActive} href="modify" scroll={false} className={`hover:bg-blue-700 text-center bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none`}>
                            수정하기
                          </Link>
                        )}
                        <Link href="list" scroll={false} className="text-center text-gray-900 bg-white border border-gray-400 font-bold py-2 px-4 rounded">
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