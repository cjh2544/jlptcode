"use client"; // 필수!
import { signIn, signOut, useSession } from "next-auth/react";
import { useSearchParams } from 'next/navigation'
import LevelUpList from "./components/levelUpList";
import LevelUpLayout from "../components/Layout/LevelUpLayout";
import { useLevelUpStore } from '@/app/store/levelUpStore';
import StrategyLayout from "../components/Layout/StrategyLayout";
import SearchBar from "./components/SearchBar";
import QuestionTest from "./components/questionTest";

const JlptPage = () => {
  const searchParams = useSearchParams();
  const levelUpInfo =useLevelUpStore((state) => state.levelUpInfo);
  
  const { data: session } = useSession();

  return (
    <StrategyLayout>
      <SearchBar />
      <QuestionTest />
      {/* <LevelUpList level={searchParams.get('level') || levelUpInfo.level || 'N1'} /> */}
    </StrategyLayout>
  )
}

export default JlptPage