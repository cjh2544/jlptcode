"use client"; // 필수!
import { signIn, signOut, useSession } from "next-auth/react";
import { useWordTodayStore } from '@/app/store/wordTodayStore';
import WordTodayLayout from "../components/Layout/WordTodayLayout";
import LevelList from "./components/levelList";
import WordList from "./components/wordList";

const WordTodayPage = () => {
  const wordTodayInfo =useWordTodayStore((state) => state.wordTodayInfo);
  
  const { data: session } = useSession();

  return (
    <WordTodayLayout>
      <LevelList level={wordTodayInfo.level || 'N0'} idx={wordTodayInfo.idx || 0} />
      <WordList />
    </WordTodayLayout>
  )
}

export default WordTodayPage