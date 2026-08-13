"use client";
import LevelList from "./components/levelList";
import SpeakList from "./components/speakList";
import SpeakMasterLayout from "../components/Layout/SpeakMasterLayout";

const SpeakMasterPage = () => {
  return (
    <SpeakMasterLayout>
      <LevelList />
      <SpeakList />
    </SpeakMasterLayout>
  )
}

export default SpeakMasterPage
