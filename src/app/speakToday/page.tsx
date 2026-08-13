"use client";
import { useSpeakTodayStore } from '@/app/store/speakTodayStore';
import SpeakTodayLayout from "../components/Layout/SpeakTodayLayout";
import LevelList from "./components/levelList";
import SpeakList from "./components/speakList";

const WordTodayPage = () => {
  const wordTodayInfo =useSpeakTodayStore((state:any) => state.wordTodayInfo);

  return (
    <SpeakTodayLayout>
      <LevelList levels={(wordTodayInfo.levels || ['N0']).toString()} idx={wordTodayInfo.idx || 0}/>
      <SpeakList />
    </SpeakTodayLayout>
  )
}

export default WordTodayPage
