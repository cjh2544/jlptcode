"use client";
import React, { ChangeEvent, memo, ReactNode, useEffect, useState } from "react";
import TabDefault from "@/app/components/Tabs/TabDefault";
import { useTodayKangiStore } from "@/app/store/todayKangiStore";
import { useClassTypeList, useStudyList } from "@/app/swr/useTodayKangi";
import PaidButton from "@/app/components/Buttons/PaidButton";
import ModalConfirm from "@/app/components/Modals/ModalConfirm";
import { useTranslations } from "@/app/providers/I18nProvider";

type LevelListProps = {
  level?: string;
};

const LevelList = (props: LevelListProps) => {
  const { t } = useTranslations();
  const { level } = props;

  const todayKangiInfo = useTodayKangiStore((state) => state.todayKangiInfo);
  const setTodayKangiInfo = useTodayKangiStore(
    (state) => state.setTodayKangiInfo,
  );
  const getTodayKangiList = useTodayKangiStore(
    (state) => state.getTodayKangiList,
  );
  const getTodayKangiAllList = useTodayKangiStore(
    (state) => state.getTodayKangiAllList,
  );
  const [confirmMsg, setConfirmMsg] = useState<ReactNode>("");
  const [isShowConfirm, setShowConfirm] = useState(false);

  const { data: levelInfos = [] } = useClassTypeList({
    params: { level: todayKangiInfo.level || level },
  });
  const { data: studyList = [] } = useStudyList({
    params: { level: todayKangiInfo.level || level },
  });

  const handleTabChange = (selectedData: any) => {
    if (!selectedData?.level) return;
    setTodayKangiInfo({
      ...todayKangiInfo,
      level: selectedData.level,
      study: "",
    });
  };

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    let next = { ...todayKangiInfo, [name]: value };
    let isSearch = true;

    if (name === "level") {
      next = { ...next, study: "" };
    } else if (name === "study") {
      isSearch = false;
    }

    setTodayKangiInfo(next, isSearch);
  };

  const handleSearch = () => {
    if (!todayKangiInfo.study) {
      setConfirmMsg(t("common.selectStudy"));
      setShowConfirm(true);
      return;
    }
    getTodayKangiAllList();
  };

  useEffect(() => {
    const levels = levelInfos[0]?.levels || [];
    if (!levels.length) return;
    const nextLevel = level && levels.includes(level) ? level : levels[0];
    if (todayKangiInfo.level !== nextLevel) {
      setTodayKangiInfo({ ...todayKangiInfo, level: nextLevel, study: "" });
      return;
    }
    // 일차 미선택 시 상단 레벨 기준 랜덤 1건
    if (!todayKangiInfo.study) {
      getTodayKangiList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levelInfos, level]);

  const levels = levelInfos[0]?.levels || [];
  const selectedIdx = Math.max(
    0,
    levels.findIndex((item: string) => item === todayKangiInfo.level),
  );
  const studies =
    studyList.find((item: any) => item.level === todayKangiInfo.level)
      ?.studies ?? [];

  return (
    <>
      <div className="px-4 mx-auto w-full m-10">
        <div className="app-panel w-full mb-6">
          <div className="app-panel-header">
            <div className="flex flex-col items-start gap-2 md:flex-row md:items-center md:justify-between md:gap-4">
              <h6 className="text-lg font-bold">{t("layout.todayKangi")}</h6>
              <strong className="app-panel-tip">{t("today.tipPaidOrder")}</strong>
            </div>
          </div>
          <div className="app-panel-body">
            <TabDefault
              onChange={handleTabChange}
              isUseContent={false}
              selectedIdx={selectedIdx}
              data={levels.map((item: string) => ({ title: item }))}
            />
            <div className="flex items-center pb-3">
              <span className="h-px flex-1 bg-gray-300"></span>
              <span className="shrink-0 px-4 text-gray-900">or</span>
              <span className="h-px flex-1 bg-gray-300"></span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-2 items-center justify-center gap-2">
              <select
                id="level"
                name="level"
                value={todayKangiInfo.level}
                onChange={handleChange}
                className="app-select"
              >
                {levels.map((item: string, idx: number) => (
                  <option key={idx} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <select
                id="study"
                name="study"
                value={todayKangiInfo.study}
                onChange={handleChange}
                className="app-select"
              >
                <option value="">{t("common.select")}</option>
                {studies.map((day: string) => (
                  <option key={day} value={day}>
                    {t("today.dayN").replace("{n}", day)}
                  </option>
                ))}
              </select>
              <PaidButton
                className="w-full sm:col-span-2"
                onClick={handleSearch}
              />
            </div>
          </div>
        </div>
      </div>
      <ModalConfirm
        type="warning"
        message={confirmMsg}
        visible={isShowConfirm}
        onClose={(visible: boolean) => setShowConfirm(visible)}
      />
    </>
  );
};

export default memo(LevelList);
