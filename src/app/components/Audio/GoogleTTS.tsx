"use client";

import { memo } from "react";
import SpeechPlayer from "@/app/components/Audio/SpeechPlayer";

type GoogleTTSProps = {
  id?: string;
  text: string;
  className?: string;
};

const GoogleTTS = ({ text, className }: GoogleTTSProps) => {
  if (!text?.trim()) return null;
  return <SpeechPlayer src={text} className={className} />;
};

export default memo(GoogleTTS);
