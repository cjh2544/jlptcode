"use client";

import React, { FormEvent, memo } from "react";
import { useUserStore } from "@/app/store/userStore";
import { useTranslations } from "@/app/providers/I18nProvider";
import { Button } from "@/components/ui/button";

type HeaderSubTitleProps = {
  title?: string;
  visibleButton?: boolean;
};

const MemberTitle = (props: HeaderSubTitleProps) => {
  const { t } = useTranslations();
  const { title, visibleButton = false } = props;

  const searchInfo = useUserStore((state: any) => state.searchInfo);
  const isLoading = useUserStore((state: any) => state.isLoading);
  const setPageInfo = useUserStore((state: any) => state.setPageInfo);
  const setSearchInfo = useUserStore((state: any) => state.setSearchInfo);
  const getUserList = useUserStore((state: any) => state.getUserList);
  const getPageInfo = useUserStore((state: any) => state.getPageInfo);
  const setLoading = useUserStore((state: any) => state.setLoading);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    setSearchInfo(Object.fromEntries(formData));

    setPageInfo({ currentPage: 1 });
    await getPageInfo();
    await getUserList();

    setLoading(false);
  };

  return (
    <div className="app-panel-header">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h6 className="text-lg font-bold">{title}</h6>
        {visibleButton && (
          <form
            onSubmit={onSubmit}
            className="min-w-[200px] flex-1 sm:flex-none"
          >
            <div className="relative flex items-center gap-1.5">
              <i
                className="fas fa-search pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-white/70"
                aria-hidden
              />
              <input
                name="keyword"
                defaultValue={searchInfo?.keyword}
                className="h-9 w-full min-w-[160px] rounded-lg border border-white/25 bg-white/15 py-2 pl-9 pr-3 text-xs text-white placeholder:text-white/60 outline-none focus:border-white/50 focus:ring-2 focus:ring-white/20 sm:w-52"
                placeholder={t("common.search")}
              />
              <Button
                type="submit"
                size="sm"
                variant="secondary"
                disabled={isLoading}
                className="h-9 shrink-0 bg-white/15 text-white hover:bg-white/25 hover:text-white"
              >
                {isLoading ? t("common.searching") : t("common.search")}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default memo(MemberTitle);
