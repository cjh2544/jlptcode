"use client"; // 필수!
import { signIn, signOut, useSession } from "next-auth/react";
import { useSearchParams } from 'next/navigation'
import { useLevelUpStore } from '@/app/store/levelUpStore';
import SearchBar from "./components/SearchBar";
import JptStrategyLayout from "../components/Layout/JptStrategyLayout";
import QuestionTest from "./components/questionTest";

const JlptPage = () => {
  const searchParams = useSearchParams();
  const levelUpInfo =useLevelUpStore((state:any) => state.levelUpInfo);
  
  const { data: session } = useSession();

  return (
    <JptStrategyLayout>
      <SearchBar />
      <QuestionTest />
      {/* <LevelUpList level={searchParams.get('level') || levelUpInfo.level || 'N1'} /> */}
    </JptStrategyLayout>
  )
}

export default JlptPage