"use client"; // 필수!
import { signIn, signOut, useSession } from "next-auth/react";
import { useGrammarTodayStore } from '@/app/store/grammarTodayStore';
import LevelList from "./components/levelList";
import SentenceList from "./components/sentenceList";
import SentenceTodayLayout from "../components/Layout/SentenceTodayLayout";

const GrammarTodayPage = () => {
  const wordTodayInfo =useGrammarTodayStore((state) => state.grammarTodayInfo);
  
  const { data: session } = useSession();

  return (
    <SentenceTodayLayout>
      <LevelList level={wordTodayInfo.level || 'N1'} />
      <SentenceList />
    </SentenceTodayLayout>
  )
}

export default GrammarTodayPage