"use client";
import TodaySpeakLayout from "../components/Layout/TodaySpeakLayout";
import LevelList from "./components/levelList";
import SpeakList from "./components/speakList";

const TodaySpeakPage = () => {
  return (
    <TodaySpeakLayout>
      <LevelList />
      <SpeakList />
    </TodaySpeakLayout>
  );
};

export default TodaySpeakPage;
