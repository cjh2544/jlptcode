"use client"; // 필수!
import { signIn, signOut, useSession } from "next-auth/react";
import MemberLayout from "@/app/components/Layout/MemberLayout";
import List from "../components/list";
import { useUserStore } from "@/app/store/userStore";
import { useCallback } from "react";
import MemberTitle from "../components/memberTitle";

const MemberListPage = () => {
  const { data: session } = useSession();
  const pageInfo = useUserStore((state) => state.pageInfo);

  const isAdmin = useCallback(() => {
    return session?.user?.role && session?.user?.role?.includes('admin');
  }, [session])

  return (
    <>
      {
        isAdmin() && (
          <>
            <MemberLayout>
              <MemberTitle title={`회원목록 (${pageInfo?.total})`} visibleButton={true} buttonTitle="문의하기" />
              <List />
            </MemberLayout>
          </>
        )
      }
    </>
  )
}

export default MemberListPage