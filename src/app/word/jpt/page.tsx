"use client"; // 필수!
import { useState, useEffect } from 'react'
import { signIn, signOut, useSession } from "next-auth/react";
import SearchBar from './components/SearchBar';
import WordContent from './components/WordContent';
import Pagination from '@/app/components/Navbars/Pagination';
import { useJptWordStore } from '@/app/store/jptWordStore';
import JptWordLayout from '@/app/components/Layout/JptWordLayout';

const JlptPage = () => {

  const { data: session } = useSession();

  const [conditions, setConditions] = useState({});
  const searchInfo = useJptWordStore((state:any) => state.searchInfo);
  const pageInfo = useJptWordStore((state:any) => state.pageInfo);
  const getWordList = useJptWordStore((state:any) => state.getWordList);
  const setPageInfo = useJptWordStore((state:any) => state.setPageInfo);
  const getPageInfo = useJptWordStore((state:any) => state.getPageInfo);
  const init = useJptWordStore((state:any) => state.init);
  
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
    <JptWordLayout>
      <SearchBar />

      <div onContextMenu={(e) => e.preventDefault()} onMouseDown={(e) => e.preventDefault()} className="w-full h-auto relative">
        <WordContent conditions={searchInfo} />
        <Pagination pageInfo={pageInfo} onPageChange={(newPage: number) => handlePageChange(newPage)} />
      </div>
    </JptWordLayout>
  )
}

export default JlptPage