"use client";
import { useTodayKangiStore } from "@/app/store/todayKangiStore";
import LevelList from "./components/levelList";
import KangiList from "./components/kangiList";
import TodayKangiLayout from "../components/Layout/TodayKangiLayout";

const TodayKangiPage = () => {
  const todayKangiInfo = useTodayKangiStore((state) => state.todayKangiInfo);

  return (
    <TodayKangiLayout>
      <LevelList level={todayKangiInfo.level || "N5"} />
      <KangiList />
    </TodayKangiLayout>
  );
};

export default TodayKangiPage;
