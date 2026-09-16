"use client";

import { memo, useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "@/app/providers/I18nProvider";

type SpeechPlayerProps = {
  src: string;
  fallbackText?: string;
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

function plainText(value: string) {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/[（(][^）)]*[）)]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
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

function toTextSrc(text?: string) {
  const value = plainText(text || "");
  if (!value) return "";
  return `/api/speech?text=${encodeURIComponent(value)}&lang=ja`;
}

function readDuration(el: HTMLAudioElement) {
  if (Number.isFinite(el.duration) && el.duration > 0) return el.duration;
  if (el.seekable.length > 0) {
    const end = el.seekable.end(el.seekable.length - 1);
    if (Number.isFinite(end) && end > 0) return end;
  }
  return 0;
}

function clamp(value: number, max: number) {
  if (!Number.isFinite(value) || value < 0) return 0;
  if (max > 0) return Math.min(value, max);
  return value;
}

const SpeechPlayer = ({ src, fallbackText, className }: SpeechPlayerProps) => {
  const { t } = useTranslations();
  const audioRef = useRef<HTMLAudioElement>(null);
  const blobUrlRef = useRef("");
  const loadPromiseRef = useRef<Promise<HTMLAudioElement> | null>(null);
  const wantPlayRef = useRef(false);
  const draggingRef = useRef(false);
  const pendingRatioRef = useRef<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState(false);
  const [useFallback, setUseFallback] = useState(false);

  const primarySrc = useMemo(() => toPlayableSrc(src), [src]);
  const fallbackSrc = useMemo(() => toTextSrc(fallbackText), [fallbackText]);
  const playableSrc = useFallback && fallbackSrc ? fallbackSrc : primarySrc;

  const revokeBlob = () => {
    if (!blobUrlRef.current) return;
    URL.revokeObjectURL(blobUrlRef.current);
    blobUrlRef.current = "";
  };

  const sync = (el: HTMLAudioElement) => {
    if (!draggingRef.current) setCurrent(el.currentTime || 0);
    const next = readDuration(el);
    if (next > 0) setDuration(next);
  };

  const applySeek = (el: HTMLAudioElement, time: number) => {
    const max = readDuration(el);
    const next = clamp(time, max);
    try {
      el.currentTime = next;
    } catch {
      pendingRatioRef.current = max > 0 ? next / max : 0;
      return;
    }
    setCurrent(next);
    if (max > 0) setDuration(max);
  };

  const applyPendingSeek = (el: HTMLAudioElement) => {
    const ratio = pendingRatioRef.current;
    if (ratio == null) return;
    const max = readDuration(el);
    if (max <= 0) return;
    pendingRatioRef.current = null;
    applySeek(el, ratio * max);
  };

  const waitForMetadata = (el: HTMLAudioElement) =>
    new Promise<void>((resolve, reject) => {
      const done = () => {
        cleanup();
        resolve();
      };
      const onErr = () => {
        cleanup();
        reject(new Error("load"));
      };
      const cleanup = () => {
        window.clearTimeout(timer);
        el.removeEventListener("loadedmetadata", done);
        el.removeEventListener("durationchange", done);
        el.removeEventListener("canplay", done);
        el.removeEventListener("error", onErr);
      };
      if (readDuration(el) > 0) {
        resolve();
        return;
      }
      const timer = window.setTimeout(done, 1500);
      el.addEventListener("loadedmetadata", done);
      el.addEventListener("durationchange", done);
      el.addEventListener("canplay", done);
      el.addEventListener("error", onErr);
    });

  const loadFromUrl = async (el: HTMLAudioElement, url: string) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error("fetch");
    const data = await response.arrayBuffer();
    if (data.byteLength < 32) throw new Error("empty");
    revokeBlob();
    const blob = new Blob([data], {
      type: response.headers.get("content-type") || "audio/mpeg",
    });
    const objectUrl = URL.createObjectURL(blob);
    blobUrlRef.current = objectUrl;
    el.src = objectUrl;
    el.load();
    await waitForMetadata(el);
    sync(el);
    applyPendingSeek(el);
    return el;
  };

  const ensureLoaded = () => {
    const el = audioRef.current;
    if (!el || !playableSrc) {
      return Promise.reject(new Error("no audio"));
    }
    if (blobUrlRef.current) {
      applyPendingSeek(el);
      return Promise.resolve(el);
    }
    if (loadPromiseRef.current) return loadPromiseRef.current;

    loadPromiseRef.current = (async () => {
      setLoading(true);
      try {
        try {
          return await loadFromUrl(el, playableSrc);
        } catch {
          if (!useFallback && fallbackSrc && fallbackSrc !== playableSrc) {
            setUseFallback(true);
            return await loadFromUrl(el, fallbackSrc);
          }
          throw new Error("load");
        }
      } finally {
        setLoading(false);
      }
    })().catch((err) => {
      loadPromiseRef.current = null;
      throw err;
    });

    return loadPromiseRef.current;
  };

  useEffect(() => {
    setPlaying(false);
    setLoading(false);
    setCurrent(0);
    setDuration(0);
    setError(false);
    setUseFallback(false);
    wantPlayRef.current = false;
    draggingRef.current = false;
    pendingRatioRef.current = null;
    loadPromiseRef.current = null;
    const el = audioRef.current;
    if (el) {
      el.pause();
      el.removeAttribute("src");
    }
    revokeBlob();
    return () => {
      loadPromiseRef.current = null;
      revokeBlob();
    };
  }, [primarySrc, fallbackSrc]);

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

  const handleMediaError = () => {
    if (!audioRef.current?.getAttribute("src") && !blobUrlRef.current) return;
    if (!useFallback && fallbackSrc && fallbackSrc !== primarySrc && !blobUrlRef.current) {
      setUseFallback(true);
      setError(false);
      setLoading(false);
      setPlaying(false);
      setCurrent(0);
      setDuration(0);
      loadPromiseRef.current = null;
      return;
    }
    setError(true);
    setLoading(false);
    setPlaying(false);
    wantPlayRef.current = false;
  };

  const toggle = async () => {
    const el = audioRef.current;
    if (!el || !playableSrc) return;

    if (playing) {
      el.pause();
      setLoading(false);
      wantPlayRef.current = false;
      return;
    }

    setError(false);
    wantPlayRef.current = true;
    try {
      const ready = await ensureLoaded();
      await ready.play();
    } catch {
      handleMediaError();
    }
  };

  const seekTo = async (time: number, ratio?: number) => {
    if (ratio != null) pendingRatioRef.current = ratio;
    setCurrent(ratio != null && duration <= 0 ? ratio : time);
    try {
      const el = await ensureLoaded();
      const max = readDuration(el);
      if (max > 0) {
        applySeek(el, ratio != null ? ratio * max : time);
      }
    } catch {
      handleMediaError();
    }
  };

  const onSliderInput = (raw: number) => {
    const max = duration > 0 ? duration : 1;
    const value = clamp(raw, max);
    if (duration > 0) {
      void seekTo(value);
      return;
    }
    void seekTo(0, value);
  };

  const stopDrag = () => {
    draggingRef.current = false;
    const el = audioRef.current;
    if (el) sync(el);
  };

  const sliderMax = duration > 0 ? duration : 1;
  const sliderValue = duration > 0 ? Math.min(current, sliderMax) : clamp(current, 1);
  const progress = sliderMax > 0 ? Math.min(100, (sliderValue / sliderMax) * 100) : 0;

  return (
    <div
      className={`app-speech-player ${className ?? ""}`.trim()}
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <audio
        ref={audioRef}
        preload="auto"
        onPlay={() => {
          setPlaying(true);
          setLoading(false);
        }}
        onPause={() => setPlaying(false)}
        onWaiting={() => setLoading(true)}
        onPlaying={() => setLoading(false)}
        onSeeked={(e) => sync(e.currentTarget)}
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
        onLoadedMetadata={(e) => {
          sync(e.currentTarget);
          applyPendingSeek(e.currentTarget);
        }}
        onCanPlay={(e) => {
          sync(e.currentTarget);
          applyPendingSeek(e.currentTarget);
        }}
        onProgress={(e) => sync(e.currentTarget)}
        onError={handleMediaError}
      />

      <button
        type="button"
        className="app-speech-play"
        onMouseDown={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
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
          value={sliderValue}
          disabled={!playableSrc}
          onChange={(e) => onSliderInput(Number(e.target.value))}
          onMouseDown={(e) => {
            e.stopPropagation();
            draggingRef.current = true;
          }}
          onPointerDown={(e) => {
            e.stopPropagation();
            draggingRef.current = true;
          }}
          onTouchStart={(e) => e.stopPropagation()}
          onMouseUp={stopDrag}
          onPointerUp={stopDrag}
          onPointerCancel={stopDrag}
          onBlur={stopDrag}
          aria-label={t("common.pronunciation")}
          style={{ "--progress": `${progress}%` } as React.CSSProperties}
        />
        <div className="app-speech-time">
          <span>{formatTime(duration > 0 ? current : 0)}</span>
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
