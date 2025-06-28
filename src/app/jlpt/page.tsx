"use client"; // 필수!
import { signIn, signOut, useSession } from "next-auth/react";
import JlptLayout from '@/app/components/Layout/JlptLayout'
import { useSearchParams } from 'next/navigation'
import JlptList from "./components/jlptList";
import { useJlptStore } from '@/app/store/jlptStore';

const JlptPage = () => {
  const searchParams = useSearchParams();
  const searchInfo =useJlptStore((state:any) => state.searchInfo);
  
  const { data: session } = useSession();

  return (
    <JlptLayout>
      <JlptList level={searchParams.get('level') || searchInfo.level || 'N1'} />
    </JlptLayout>
  )
}

export default JlptPage