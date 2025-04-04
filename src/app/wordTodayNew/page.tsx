"use client"; // 필수!
import { signIn, signOut, useSession } from "next-auth/react";
import { useWordTodayNewStore } from '@/app/store/wordTodayNewStore';
import WordTodayLayout from "../components/Layout/WordTodayLayout";
import LevelList from "./components/levelList";
import WordList from "./components/wordList";

const WordTodayPage = () => {
  const wordTodayInfo =useWordTodayNewStore((state) => state.wordTodayInfo);
  
  const { data: session } = useSession();

  return (
    <WordTodayLayout>
      <LevelList level={wordTodayInfo.level || 'N1'} selectedIdx={wordTodayInfo.idx || 1} />
      <WordList />
    </WordTodayLayout>
  )
}

export default WordTodayPage