"use client"; // 필수!
import { signIn, signOut, useSession } from "next-auth/react";
import { useSpeakTodayStore } from '@/app/store/speakTodayStore';
import SpeakTodayLayout from "../components/Layout/SpeakTodayLayout";
import LevelList from "./components/levelList";
import SpeakList from "./components/speakList";

const WordTodayPage = () => {
  const wordTodayInfo =useSpeakTodayStore((state:any) => state.wordTodayInfo);
  
  const { data: session } = useSession();

  return (
    <SpeakTodayLayout>
      <LevelList level={wordTodayInfo.level} levels={(wordTodayInfo.levels || ['N0']).toString()} idx={wordTodayInfo.idx || 0}/>
      <SpeakList />
    </SpeakTodayLayout>
  )
}

export default WordTodayPage