import { useRef, useState } from "react";

type SpeakerProps = {
  fileId?: string,
}

const Speaker = ({fileId = '18U14TjZoj4pG6kBLWhi4RrkEbshx7aVZ'}: SpeakerProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

  const togglePlayback = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch((err) => {
        console.error('Playback failed:', err);
      });
    }

    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex items-center">
      <button onClick={togglePlayback} className="text-2xl">
        {isPlaying ? '🔊' : '🔈'}
      </button>
      <audio ref={audioRef} src={audioUrl} preload="auto" />
    </div>
  );
};

export default Speaker;