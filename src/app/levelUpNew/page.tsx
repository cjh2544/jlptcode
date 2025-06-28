"use client"; // 필수!
import { signIn, signOut, useSession } from "next-auth/react";
import { useSearchParams } from 'next/navigation'
import LevelUpList from "./components/levelUpList";
import LevelUpLayout from "../components/Layout/LevelUpLayout";
import { useLevelUpStore } from '@/app/store/levelUpNewStore';

const JlptPage = () => {
  const searchParams = useSearchParams();
  const levelUpInfo =useLevelUpStore((state:any) => state.levelUpInfo);
  
  const { data: session } = useSession();

  return (
    <LevelUpLayout>
      <LevelUpList level={searchParams.get('level') || levelUpInfo.level || 'N1'} />
    </LevelUpLayout>
  )
}

export default JlptPage