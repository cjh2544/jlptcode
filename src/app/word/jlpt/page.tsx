"use client"; // 필수!
import { useEffect } from 'react'
import { useSession } from "next-auth/react";
import WordLayout from '@/app/components/Layout/WordLayout'
import SearchBar from './components/SearchBar';
import WordContent from './components/WordContent';
import PaginationNew from '@/app/components/Navbars/PaginationNew';
import { useWordStore } from '@/app/store/wordStore';

const JlptPage = () => {

  const { data: session } = useSession();

  const searchInfo = useWordStore((state:any) => state.searchInfo);
  const pageInfo = useWordStore((state:any) => state.pageInfo);
  const getWordList = useWordStore((state:any) => state.getWordList);
  const setPageInfo = useWordStore((state:any) => state.setPageInfo);
  const getPageInfo = useWordStore((state:any) => state.getPageInfo);
  const init = useWordStore((state:any) => state.init);
  
  const handlePageChange = (page: number) => {
    if (!pageInfo || page === pageInfo.currentPage) return;
    setPageInfo({...pageInfo, currentPage: page});
    getWordList();
  }

  useEffect(() => {
    init();
    getWordList();
    getPageInfo();
  }, [])

  return (
    <WordLayout>
      <SearchBar />

      <div onContextMenu={(e) => e.preventDefault()} onMouseDown={(e) => e.preventDefault()} className="w-full h-auto relative">
        <WordContent conditions={searchInfo} />
        <div className="mx-4 mb-8">
          <PaginationNew
            pageInfo={pageInfo}
            onPageChange={(newPage: number) => handlePageChange(newPage)}
          />
        </div>
      </div>
    </WordLayout>
  )
}

export default JlptPage
