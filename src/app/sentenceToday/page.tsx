"use client"; // 필수!
import { signIn, signOut, useSession } from "next-auth/react";
import { useSentenceTodayStore } from '@/app/store/sentenceTodayStore';
import LevelList from "./components/levelList";
import SentenceList from "./components/sentenceList";
import SentenceTodayLayout from "../components/Layout/SentenceTodayLayout";

const SentenceTodayPage = () => {
  const wordTodayInfo =useSentenceTodayStore((state:any) => state.wordTodayInfo);
  
  const { data: session } = useSession();

  return (
    <SentenceTodayLayout>
      <LevelList level={wordTodayInfo.level || 'N1'} idx={wordTodayInfo.idx || 0} />
      <SentenceList />
    </SentenceTodayLayout>
  )
}

export default SentenceTodayPage