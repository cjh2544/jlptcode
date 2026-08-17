"use client";
import AdminLayout from "@/app/components/Layout/AdminLayout";
import List from "./member/components/list";
import { useUserStore } from "@/app/store/userStore";
import MemberTitle from "./member/components/memberTitle";
import { useTranslations } from "@/app/providers/I18nProvider";

const AdminPage = () => {
  const { t } = useTranslations();
  const pageInfo = useUserStore((state:any) => state.pageInfo);

  return (
    <AdminLayout>
      <div className="px-0 sm:px-4 mx-auto w-full my-10">
        <div className="app-panel w-full">
          <MemberTitle title={`${t('member.listTitle')} (${pageInfo?.total})`} visibleButton={true} />
          <List />
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminPage
