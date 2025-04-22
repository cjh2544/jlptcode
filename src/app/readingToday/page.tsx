"use client"; // 필수!
import { signIn, signOut, useSession } from "next-auth/react";
import { useSentenceTodayStore } from '@/app/store/sentenceTodayStore';
import LevelList from "./components/levelList";
import SentenceList from "./components/sentenceList";
import ReadingTodayLayout from "../components/Layout/ReadingTodayLayout";

const SentenceTodayPage = () => {
  const wordTodayInfo =useSentenceTodayStore((state) => state.wordTodayInfo);
  
  const { data: session } = useSession();

  return (
    <ReadingTodayLayout>
      <LevelList level={wordTodayInfo.level || 'N1'} idx={wordTodayInfo.idx || 0} />
      <SentenceList />
    </ReadingTodayLayout>
  )
}

export default SentenceTodayPage