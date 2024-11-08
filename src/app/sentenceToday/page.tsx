"use client"; // 필수!
import { signIn, signOut, useSession } from "next-auth/react";
import { useWordTodayStore } from '@/app/store/wordTodayStore';
import LevelList from "./components/levelList";
import SentenceList from "./components/sentenceList";
import SentenceTodayLayout from "../components/Layout/SentenceTodayLayout";

const SentenceTodayPage = () => {
  const wordTodayInfo =useWordTodayStore((state) => state.wordTodayInfo);
  
  const { data: session } = useSession();

  return (
    <SentenceTodayLayout>
      <LevelList level={wordTodayInfo.level || 'N1'} />
      <SentenceList />
    </SentenceTodayLayout>
  )
}

export default SentenceTodayPage