"use client";

import SpeakList from "@/app/components/Speak/SpeakList";

export default function SpeakMasterList(props: { className?: string }) {
  return <SpeakList {...props} source="speakMaster" />;
}
