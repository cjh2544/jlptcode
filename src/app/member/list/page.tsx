"use client";
import MemberLayout from "@/app/components/Layout/MemberLayout";
import List from "../components/list";
import { useUserStore } from "@/app/store/userStore";
import MemberTitle from "../components/memberTitle";
import { useTranslations } from "@/app/providers/I18nProvider";

const MemberListPage = () => {
  const { t } = useTranslations();
  const pageInfo = useUserStore((state:any) => state.pageInfo);

  return (
    <MemberLayout>
      <MemberTitle title={`${t('member.listTitle')} (${pageInfo?.total})`} visibleButton={true} />
      <List />
    </MemberLayout>
  )
}

export default MemberListPage
