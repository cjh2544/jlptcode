"use client"; // 필수!
import { signIn, signOut, useSession } from "next-auth/react";
import { useWordTodayNewStore } from '@/app/store/wordTodayNewStore';
import SpeakTodayLayout from "../components/Layout/SpeakTodayLayout";
import LevelList from "./components/levelList";
import SpeakList from "./components/speakList";

const WordTodayPage = () => {
  const wordTodayInfo =useWordTodayNewStore((state) => state.wordTodayInfo);
  
  const { data: session } = useSession();

  return (
    <SpeakTodayLayout>
      <LevelList levels={wordTodayInfo.levels.toString() || 'N5'} selectedIdx={wordTodayInfo.idx || 0} />
      <SpeakList />
    </SpeakTodayLayout>
  )
}

export default WordTodayPage