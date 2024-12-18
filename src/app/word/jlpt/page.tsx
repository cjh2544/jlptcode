"use client"; // 필수!
import { useState, useEffect } from 'react'
import { signIn, signOut, useSession } from "next-auth/react";
import WordLayout from '@/app/components/Layout/WordLayout'
import SearchBar from './components/SearchBar';
import WordContent from './components/WordContent';
import Pagination from '@/app/components/Navbars/Pagination';
import { useWordStore } from '@/app/store/wordStore';

const JlptPage = () => {

  const { data: session } = useSession();

  const [conditions, setConditions] = useState({});
  const searchInfo = useWordStore((state) => state.searchInfo);
  const pageInfo = useWordStore((state) => state.pageInfo);
  const getWordList = useWordStore((state) => state.getWordList);
  const setPageInfo = useWordStore((state) => state.setPageInfo);
  const getPageInfo = useWordStore((state) => state.getPageInfo);
  const init = useWordStore((state) => state.init);
  
  const handlePageChange = (page: number) => {
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
        <Pagination pageInfo={pageInfo} onPageChange={(newPage: number) => handlePageChange(newPage)} />
      </div>
    </WordLayout>
  )
}

export default JlptPage