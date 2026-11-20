"use client";
import React, { memo, useEffect } from "react";
import { useTodaySpeakStore } from "@/app/store/todaySpeakStore";
import { useTranslations } from "@/app/providers/I18nProvider";
import { Button } from "@/components/ui/button";

const LevelList = () => {
  const { t } = useTranslations();
  const getTodaySpeakList = useTodaySpeakStore(
    (state) => state.getTodaySpeakList,
  );

  useEffect(() => {
    getTodaySpeakList();
  }, [getTodaySpeakList]);

  return (
    <div className="px-4 mx-auto w-full m-10">
      <div className="app-panel w-full mb-6">
        <div className="app-panel-header">
          <h6 className="text-lg font-bold">{t("layout.todaySpeak")}</h6>
        </div>
        <div className="app-panel-body">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              className="gap-1.5"
              onClick={() => getTodaySpeakList()}
            >
              <i className="fas fa-shuffle" aria-hidden />
              <span>{t("common.random")}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(LevelList);
