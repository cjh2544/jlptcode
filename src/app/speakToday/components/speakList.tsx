"use client";

import SpeakList from "@/app/components/Speak/SpeakList";

export default function SpeakTodayList(props: { className?: string }) {
  return <SpeakList {...props} source="speakToday" />;
}
