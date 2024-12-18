"use client"; // 필수!
import { useState, useEffect } from 'react'
import { signIn, signOut, useSession } from "next-auth/react";
import WordLayout from '@/app/components/Layout/WordLayout'
import WordContent from './components/WordContent';
import SearchBar from './components/SearchBar';
import { useWordStore } from '@/app/store/wordStore';

const SlidePage = () => {
  const { data: session } = useSession();

  const init = useWordStore((state) => state.init);
  const getWordList = useWordStore((state) => state.getWordList);
  const getPageInfo = useWordStore((state) => state.getPageInfo);
  const [conditions, setConditions] = useState({});
  
  const handleSearch = (data: any) => {
    setConditions(data);
  }

  useEffect(() => {
    init();
    getWordList();
    getPageInfo();
  }, [])

  return (
    <WordLayout>
      <SearchBar onSearch={(data: any) => handleSearch(data)} />

      <div onContextMenu={(e) => e.preventDefault()} onMouseDown={(e) => e.preventDefault()} className="w-full h-auto relatives">
        <WordContent conditions={conditions} />
      </div>
    </WordLayout>
  )
}

export default SlidePage