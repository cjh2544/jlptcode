"use client";

import { memo, useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "@/app/providers/I18nProvider";

type SpeechPlayerProps = {
  src: string;
  className?: string;
};

function formatTime(sec: number) {
  if (!Number.isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function extractSrc(src: string) {
  const iframeSrc = src.match(/src=["']([^"']+)["']/);
  if (src.includes("<iframe") && iframeSrc?.[1]) return iframeSrc[1];
  return src.trim();
}

function toPlayableSrc(src: string) {
  const value = extractSrc(src);
  if (!value) return "";
  if (value.startsWith("/api/speech")) return value;
  if (/^https?:\/\//i.test(value)) {
    return `/api/speech?url=${encodeURIComponent(value)}`;
  }
  return `/api/speech?text=${encodeURIComponent(value)}&lang=ja`;
}

function readDuration(el: HTMLAudioElement) {
  const value = el.duration;
  return Number.isFinite(value) && value > 0 ? value : 0;
}

const SpeechPlayer = ({ src, className }: SpeechPlayerProps) => {
  const { t } = useTranslations();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState(false);

  const playableSrc = useMemo(() => toPlayableSrc(src), [src]);

  const sync = (el: HTMLAudioElement) => {
    setCurrent(el.currentTime || 0);
    const next = readDuration(el);
    if (next > 0) setDuration(next);
  };

  useEffect(() => {
    setPlaying(false);
    setLoading(false);
    setCurrent(0);
    setDuration(0);
    setError(false);
    audioRef.current?.pause();
  }, [playableSrc]);

  useEffect(() => {
    if (!playing) return;

    const tick = () => {
      const el = audioRef.current;
      if (el) sync(el);
    };

    tick();
    const timer = window.setInterval(tick, 50);
    return () => window.clearInterval(timer);
  }, [playing]);

  const toggle = async () => {
    const el = audioRef.current;
    if (!el || !playableSrc) return;

    if (playing) {
      el.pause();
      setLoading(false);
      return;
    }

    setError(false);
    setLoading(true);
    try {
      await el.play();
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSeek = (value: number) => {
    const el = audioRef.current;
    if (!el || duration <= 0) return;
    el.currentTime = value;
    setCurrent(value);
  };

  const sliderMax = duration > 0 ? duration : Math.max(current, 0.01);
  const progress = sliderMax > 0 ? Math.min(100, (current / sliderMax) * 100) : 0;

  return (
    <div className={`app-speech-player ${className ?? ""}`.trim()}>
      <audio
        ref={audioRef}
        src={playableSrc || undefined}
        preload="none"
        onPlay={() => {
          setPlaying(true);
          setLoading(false);
        }}
        onPause={() => setPlaying(false)}
        onWaiting={() => setLoading(true)}
        onPlaying={() => setLoading(false)}
        onEnded={() => {
          const el = audioRef.current;
          if (el && duration <= 0 && el.currentTime > 0) {
            setDuration(el.currentTime);
          }
          setPlaying(false);
          setCurrent(0);
        }}
        onTimeUpdate={(e) => sync(e.currentTarget)}
        onDurationChange={(e) => sync(e.currentTarget)}
        onLoadedMetadata={(e) => sync(e.currentTarget)}
        onCanPlay={(e) => sync(e.currentTarget)}
        onError={() => setError(true)}
      />

      <button
        type="button"
        className="app-speech-play"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={toggle}
        disabled={!playableSrc}
        aria-label={playing ? t("common.pause") : t("common.play")}
      >
        <i className={loading ? "fas fa-spinner fa-spin" : playing ? "fas fa-pause" : "fas fa-play"} />
      </button>

      <div className="app-speech-track">
        <input
          type="range"
          min={0}
          max={sliderMax}
          step={0.05}
          value={Math.min(current, sliderMax)}
          onChange={(e) => handleSeek(Number(e.target.value))}
          onMouseDown={(e) => e.stopPropagation()}
          aria-label={t("common.pronunciation")}
          style={{ "--progress": `${progress}%` } as React.CSSProperties}
        />
        <div className="app-speech-time">
          <span>{formatTime(current)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {error && (
        <p className="app-speech-error">{t("common.audioUnavailable")}</p>
      )}
    </div>
  );
};

export default memo(SpeechPlayer);
