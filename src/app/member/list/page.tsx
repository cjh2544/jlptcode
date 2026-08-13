"use client";
import { useSession } from "next-auth/react";
import MemberLayout from "@/app/components/Layout/MemberLayout";
import List from "../components/list";
import { useUserStore } from "@/app/store/userStore";
import { useCallback } from "react";
import MemberTitle from "../components/memberTitle";
import { useTranslations } from "@/app/providers/I18nProvider";

const MemberListPage = () => {
  const { t } = useTranslations();
  const { data: session } = useSession();
  const pageInfo = useUserStore((state:any) => state.pageInfo);

  const isAdmin = useCallback(() => {
    return session?.user?.role && session?.user?.role?.includes('admin');
  }, [session])

  return (
    <>
      {
        isAdmin() && (
          <MemberLayout>
            <MemberTitle title={`${t('member.listTitle')} (${pageInfo?.total})`} visibleButton={true} />
            <List />
          </MemberLayout>
        )
      }
    </>
  )
}

export default MemberListPage
