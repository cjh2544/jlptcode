"use client";

import React, { FormEvent, memo, useState } from "react";
import { useUserStore } from "@/app/store/userStore";
import { useTranslations } from "@/app/providers/I18nProvider";
import { Button } from "@/components/ui/button";

type HeaderSubTitleProps = {
  title?: string;
  visibleButton?: boolean;
};

const searchInputClass =
  "h-9 w-full min-w-0 rounded-lg border border-white/25 bg-white/15 py-2 pl-9 pr-3 text-sm text-white placeholder:text-white/60 outline-none focus:border-white/50 focus:ring-2 focus:ring-white/20 lg:text-xs";

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
  const [formKey, setFormKey] = useState(0);

  const reloadList = async (nextSearch: Record<string, string>) => {
    setLoading(true);
    setSearchInfo(nextSearch);
    setPageInfo({ currentPage: 1 });
    await getPageInfo();
    await getUserList();
    setLoading(false);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    await reloadList(Object.fromEntries(formData) as Record<string, string>);
  };

  const onReset = async () => {
    setFormKey((prev) => prev + 1);
    await reloadList({});
  };

  return (
    <div className="app-panel-header">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <h6 className="text-lg font-bold">{title}</h6>
        {visibleButton ? (
          <form
            key={`member-search-${formKey}`}
            onSubmit={onSubmit}
            className="w-full min-w-0 rounded-xl border border-white/10 bg-white/5 p-3 lg:w-auto lg:shrink-0 lg:p-2"
          >
            <div className="flex w-full flex-col gap-2 md:flex-row md:items-center lg:gap-2">
              <div className="relative w-full min-w-0 md:min-w-[12rem] md:flex-1 lg:w-64 lg:flex-none">
                <i
                  className="fas fa-search pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-white/70"
                  aria-hidden
                />
                <input
                  name="keyword"
                  defaultValue={searchInfo?.keyword}
                  className={searchInputClass}
                  placeholder={t("common.search")}
                />
              </div>
              <div className="flex w-full shrink-0 gap-2 md:w-auto">
                <Button
                  type="submit"
                  size="sm"
                  variant="secondary"
                  disabled={isLoading}
                  className="h-9 min-w-[4.5rem] flex-1 shrink-0 bg-white/15 text-white hover:bg-white/25 hover:text-white md:flex-none"
                >
                  {isLoading ? t("common.searching") : t("common.search")}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={isLoading}
                  onClick={onReset}
                  className="h-9 min-w-[4.5rem] flex-1 border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white md:flex-none"
                >
                  {t("admin.resetSearch")}
                </Button>
              </div>
            </div>
          </form>
        ) : null}
      </div>
    </div>
  );
};

export default memo(MemberTitle);
