"use client";

import React, { memo } from "react";
import SpeechPlayer from "@/app/components/Audio/SpeechPlayer";
type AudioProps = {
  audio?: any;
  speaker?: string;
};

const CardAudio = (props: AudioProps) => {
  const { audio, speaker } = props;
  const { link } = audio || {};
  const playbackSrc = speaker || link;

  if (!playbackSrc) {
    return null;
  }

  return (
    <div className="app-question-media">
      <SpeechPlayer src={playbackSrc} />
    </div>
  );
};

export default memo(CardAudio);
