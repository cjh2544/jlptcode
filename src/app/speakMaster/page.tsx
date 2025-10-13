"use client"; // 필수!
import { signIn, signOut, useSession } from "next-auth/react";
import { useSpeakTodayStore } from '@/app/store/speakTodayStore';
import LevelList from "./components/levelList";
import SpeakList from "./components/speakList";
import SpeakMasterLayout from "../components/Layout/SpeakMasterLayout";

const WordTodayPage = () => {
  const wordTodayInfo =useSpeakTodayStore((state:any) => state.wordTodayInfo);
  
  const { data: session } = useSession();

  return (
    <SpeakMasterLayout>
      <LevelList level={wordTodayInfo.level} levels={(wordTodayInfo.levels || ['N0']).toString()} idx={wordTodayInfo.idx || 0}/>
      <SpeakList />
    </SpeakMasterLayout>
  )
}

export default WordTodayPage