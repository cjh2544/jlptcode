"use client"; // 필수!
import { signIn, signOut, useSession } from "next-auth/react";
import { useSearchParams } from 'next/navigation'
import JlptList from "./components/jlptList";
import { useJlptTestStore } from '@/app/store/jlptTestStore';
import JlptTestLayout from "../components/Layout/JlptTestLayout";

const JlptPage = () => {
  const searchParams = useSearchParams();
  const searchInfo =useJlptTestStore((state:any) => state.searchInfo);
  
  const { data: session } = useSession();

  return (
    <JlptTestLayout>
      <JlptList level={searchParams.get('level') || searchInfo.level || 'N1'} />
    </JlptTestLayout>
  )
}

export default JlptPage