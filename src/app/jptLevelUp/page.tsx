"use client"; // 필수!
import { signIn, signOut, useSession } from "next-auth/react";
import { useSearchParams } from 'next/navigation'
import LevelUpList from "./components/levelUpList";
import { useJptStore } from '@/app/store/jptStore';
import JptLevelUpLayout from "../components/Layout/JptLevelUpLayout";

const JlptPage = () => {
  const searchParams = useSearchParams();
  const levelUpInfo =useJptStore((state:any) => state.jptInfo);

  return (
    <JptLevelUpLayout>
      <LevelUpList level={searchParams.get('level') || levelUpInfo.level || 'N1'} />
    </JptLevelUpLayout>
  )
}

export default JlptPage