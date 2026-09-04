"use client";

import React, { FormEvent, memo, useState } from "react";
import { useAdminDataStore } from "@/app/store/adminDataStore";
import { useTranslations } from "@/app/providers/I18nProvider";
import { Button } from "@/components/ui/button";
import type { AdminFilterField } from "@/app/admin/data/table-config";

type AdminDataTitleProps = {
  title: string;
  table: string;
  filterFields?: AdminFilterField[];
  onAdd: () => void;
};

const filterInputClass =
  "h-9 w-full min-w-0 rounded-lg border border-white/25 bg-white/15 px-3 text-sm text-white placeholder:text-white/60 outline-none focus:border-white/50 focus:ring-2 focus:ring-white/20 lg:text-xs";

const actionButtonClass =
  "h-9 shrink-0 bg-white/15 text-white hover:bg-white/25 hover:text-white";

const resetButtonClass =
  "h-9 shrink-0 border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white";

const AdminDataTitle = ({
  title,
  table,
  filterFields = [],
  onAdd,
}: AdminDataTitleProps) => {
  const { t } = useTranslations();
  const searchInfo = useAdminDataStore((state) => state.searchInfo);
  const isLoading = useAdminDataStore((state) => state.isLoading);
  const pageInfo = useAdminDataStore((state) => state.pageInfo);
  const setPageInfo = useAdminDataStore((state) => state.setPageInfo);
  const setSearchInfo = useAdminDataStore((state) => state.setSearchInfo);
  const getPageInfo = useAdminDataStore((state) => state.getPageInfo);
  const getList = useAdminDataStore((state) => state.getList);
  const setLoading = useAdminDataStore((state) => state.setLoading);
  const [formKey, setFormKey] = useState(0);

  const reloadList = async (nextSearch: Record<string, string>) => {
    setLoading(true);
    setSearchInfo(nextSearch);
    setPageInfo({ currentPage: 1 });
    await getPageInfo();
    await getList();
    setLoading(false);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const nextSearch: Record<string, string> = {};
    formData.forEach((value, key) => {
      nextSearch[key] = String(value);
    });
    await reloadList(nextSearch);
  };

  const onReset = async () => {
    setFormKey((prev) => prev + 1);
    await reloadList({});
  };

  const filterLabel = (field: AdminFilterField) =>
    t(field.labelKey ?? `admin.fields.${field.key}`);

  const hasFilters = filterFields.length > 0;

  return (
    <div className="app-panel-header">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <h6 className="text-lg font-bold">
            {title}
            {pageInfo?.total != null ? ` (${pageInfo.total})` : ""}
          </h6>
          <Button
            type="button"
            size="sm"
            className="h-9 w-full shrink-0 lg:w-auto"
            onClick={onAdd}
          >
            {t("admin.add")}
          </Button>
        </div>

        <form
          key={`${table}-search-${formKey}`}
          onSubmit={onSubmit}
          className="rounded-xl border border-white/10 bg-white/5 p-3 lg:p-4"
        >
          <div
            className={
              hasFilters
                ? "flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between lg:gap-4"
                : "flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-end"
            }
          >
            {hasFilters ? (
              <div className="grid min-w-0 flex-1 grid-cols-1 gap-2 min-[480px]:grid-cols-2 md:grid-cols-3 lg:flex lg:flex-wrap lg:gap-3">
                {filterFields.map((field) => (
                  <label
                    key={field.key}
                    className="grid min-w-0 gap-1 lg:w-36 lg:shrink-0 xl:w-40"
                  >
                    <span className="truncate text-[11px] text-white/80">
                      {filterLabel(field)}
                    </span>
                    <input
                      name={field.key}
                      defaultValue={searchInfo?.[field.key] ?? ""}
                      className={filterInputClass}
                      placeholder={filterLabel(field)}
                    />
                  </label>
                ))}
              </div>
            ) : null}

            <div
              className={
                hasFilters
                  ? "flex w-full shrink-0 flex-col gap-2 md:flex-row md:items-center lg:w-auto lg:gap-2"
                  : "flex w-full flex-col gap-2 md:flex-row md:items-center lg:w-auto lg:justify-end"
              }
            >
              <div
                className={
                  hasFilters
                    ? "relative w-full min-w-0 md:min-w-[12rem] md:flex-1 lg:w-64 lg:flex-none xl:w-72"
                    : "relative w-full min-w-0 md:flex-1 lg:w-72 lg:flex-none"
                }
              >
                <i
                  className="fas fa-search pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-white/70"
                  aria-hidden
                />
                <input
                  name="keyword"
                  defaultValue={searchInfo?.keyword ?? ""}
                  className={`${filterInputClass} pl-9`}
                  placeholder={t("common.search")}
                />
              </div>
              <div className="flex w-full shrink-0 gap-2 md:w-auto">
                <Button
                  type="submit"
                  size="sm"
                  variant="secondary"
                  disabled={isLoading}
                  className={`${actionButtonClass} min-w-[4.5rem] flex-1 md:flex-none`}
                >
                  {isLoading ? t("common.searching") : t("common.search")}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={isLoading}
                  onClick={onReset}
                  className={`${resetButtonClass} min-w-[4.5rem] flex-1 md:flex-none`}
                >
                  {t("admin.resetSearch")}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default memo(AdminDataTitle);
