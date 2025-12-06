"use client"; // 필수!
import { signIn, signOut, useSession } from "next-auth/react";
import { useSpeakTodayStore } from '@/app/store/speakTodayStore';
import LevelList from "./components/levelList";
import SpeakList from "./components/speakList";
import SpeakTestLayout from "../components/Layout/SpeakTestLayout";

const WordTodayPage = () => {
  const wordTodayInfo =useSpeakTodayStore((state:any) => state.wordTodayInfo);
  
  const { data: session } = useSession();

  return (
    <SpeakTestLayout>
      <LevelList level={wordTodayInfo.level} levels={(wordTodayInfo.levels || ['N0']).toString()} idx={wordTodayInfo.idx || 0}/>
      <SpeakList />
    </SpeakTestLayout>
  )
}

export default WordTodayPage