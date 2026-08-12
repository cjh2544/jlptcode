"use client";

import React, { FormEvent, memo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useBoardCommunityStore } from "@/app/store/boardCommunityStore";
import { useTranslations } from "@/app/providers/I18nProvider";
import { Button } from "@/components/ui/button";

type HeaderSubTitleProps = {
  title?: string;
  visibleButton?: boolean;
  buttonTitle?: string;
};

const BoardTitle = (props: HeaderSubTitleProps) => {
  const { t } = useTranslations();
  const {
    title,
    visibleButton = false,
    buttonTitle = t("board.write"),
  } = props;
  const { data: session } = useSession();
  const router = useRouter();

  const searchInfo = useBoardCommunityStore((state: any) => state.searchInfo);
  const isLoading = useBoardCommunityStore((state: any) => state.isLoading);
  const setPageInfo = useBoardCommunityStore((state: any) => state.setPageInfo);
  const setSearchInfo = useBoardCommunityStore(
    (state: any) => state.setSearchInfo,
  );
  const getBoardList = useBoardCommunityStore(
    (state: any) => state.getBoardList,
  );
  const setLoading = useBoardCommunityStore((state: any) => state.setLoading);

  const handleClickWrite = () => {
    router.push("write", { scroll: false });
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    setSearchInfo(Object.fromEntries(formData));
    setPageInfo({ currentPage: 1 });
    await getBoardList();

    setLoading(false);
  };

  return (
    <div className="app-panel-header">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h6 className="text-lg font-bold">{title}</h6>
        {visibleButton && (
          <div className="flex flex-wrap items-center gap-2">
            <form onSubmit={onSubmit} className="min-w-[200px] flex-1 sm:flex-none">
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
            <Button
              type="button"
              size="sm"
              disabled={!session}
              onClick={handleClickWrite}
              className="h-9 shrink-0"
            >
              <i className="fas fa-pen" aria-hidden />
              {buttonTitle}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(BoardTitle);
