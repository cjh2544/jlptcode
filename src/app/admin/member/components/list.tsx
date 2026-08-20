"use client";

import React, { memo, useEffect } from "react";
import PaginationNew from "@/app/components/Navbars/PaginationNew";
import { useUserStore } from "@/app/store/userStore";
import LoadingSkeleton from "@/app/components/Loading/loadingSkeleton";
import MemberRowInfo from "./memberRowInfo";
import { isEmpty } from "lodash";
import EmptyData from "@/app/components/Alert/EmptyData";
import { useTranslations } from "@/app/providers/I18nProvider";

const MemberList = () => {
  const { t } = useTranslations();
  const pageInfo = useUserStore((state: any) => state.pageInfo);
  const userList = useUserStore((state: any) => state.userList);
  const isLoading = useUserStore((state: any) => state.isLoading);
  const setPageInfo = useUserStore((state: any) => state.setPageInfo);
  const getPageInfo = useUserStore((state: any) => state.getPageInfo);
  const getUserList = useUserStore((state: any) => state.getUserList);

  const handlePageChange = async (newPageNo: number) => {
    if (!pageInfo || newPageNo === pageInfo.currentPage) return;

    setPageInfo({ currentPage: newPageNo });
    await getUserList();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    getPageInfo();
    getUserList();
  }, []);

  return (
    <div className="app-panel-body app-member-list">
      <div className="overflow-x-auto rounded-lg border border-[var(--border)]">
        <table className="app-board-table app-member-table min-w-full">
          <thead>
            <tr>
              <th className="w-auto">{t("member.name")}</th>
              <th className="hidden w-48 md:table-cell">{t("member.email")}</th>
              <th className="hidden w-28 md:table-cell">{t("member.role")}</th>
              <th className="hidden w-40 lg:table-cell">
                {t("member.createdAt")}
              </th>
              <th className="hidden w-52 lg:table-cell">
                {t("member.paidPeriod")}
              </th>
              <th className="hidden w-36 md:table-cell">{t("member.paidType")}</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="!p-0">
                  <LoadingSkeleton />
                </td>
              </tr>
            ) : isEmpty(userList) ? (
              <tr>
                <td colSpan={6} className="!p-6">
                  <EmptyData />
                </td>
              </tr>
            ) : (
              userList.map((userInfo: User, idx: number) => (
                <MemberRowInfo
                  key={userInfo.email || idx}
                  userInfo={userInfo}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
      <PaginationNew
        pageInfo={pageInfo}
        onPageChange={(newPage: number) => handlePageChange(newPage)}
      />
    </div>
  );
};

export default memo(MemberList);
