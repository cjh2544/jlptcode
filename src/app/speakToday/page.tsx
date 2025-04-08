"use client"; // 필수!
import { signIn, signOut, useSession } from "next-auth/react";
import { useWordTodayStore } from '@/app/store/wordTodayStore';
import SpeakTodayLayout from "../components/Layout/SpeakTodayLayout";
import LevelList from "./components/levelList";
import SpeakList from "./components/speakList";

const WordTodayPage = () => {
  const wordTodayInfo =useWordTodayStore((state) => state.wordTodayInfo);
  
  const { data: session } = useSession();

  return (
    <SpeakTodayLayout>
      <LevelList levels={wordTodayInfo.levels.toString() || 'N5'} selectedIdx={wordTodayInfo.idx || 0} />
      <SpeakList />
    </SpeakTodayLayout>
  )
}

export default WordTodayPage