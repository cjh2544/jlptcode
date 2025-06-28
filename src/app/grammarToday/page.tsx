"use client"; // 필수!
import { signIn, signOut, useSession } from "next-auth/react";
import { useGrammarTodayStore } from '@/app/store/grammarTodayStore';
import LevelList from "./components/levelList";
import SentenceList from "./components/sentenceList";
import GrammarTodayLayout from "../components/Layout/GrammarTodayLayout";

const GrammarTodayPage = () => {
  const wordTodayInfo =useGrammarTodayStore((state:any) => state.grammarTodayInfo);
  
  const { data: session } = useSession();

  return (
    <GrammarTodayLayout>
      <LevelList level={wordTodayInfo.level || 'N1'} />
      <SentenceList />
    </GrammarTodayLayout>
  )
}

export default GrammarTodayPage