"use client";

import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Autoplay, Pagination, Navigation } from "swiper/modules";
import WordCard from "./WordCard";
import ModalFullScreen from "@/app/components/Modals/ModalFullScreen";
import { useWordStore } from "@/app/store/wordStore";
import { isEmpty } from "lodash";
import { useTranslations } from "@/app/providers/I18nProvider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type WordTableProps = {
  conditions?: any;
};

const SPEED_OPTIONS = [
  { value: 4000, labelKey: "word.speedSlow" },
  { value: 3000, labelKey: "word.speedNormal" },
  { value: 2000, labelKey: "word.speedFast" },
] as const;

const WordContent = (props: WordTableProps) => {
  const { t } = useTranslations();

  const [isFullScreen, setFullScreen] = useState<boolean>(false);
  const wordList = useWordStore((state: any) => state.wordList);
  const searchInfo = useWordStore((state: any) => state.searchInfo);
  const showDelay = useWordStore((state: any) => state.showDelay);
  const speed = useWordStore((state: any) => state.speed);
  const autoSlide = useWordStore((state: any) => state.autoSlide);
  const setStoreData = useWordStore((state: any) => state.setStoreData);
  const [realIndex, setRealIndex] = useState<number>(1);

  const swiperRef = useRef<any>(null);

  const applyAutoplay = (swiper: any, enabled: boolean, delay: number) => {
    if (!swiper?.autoplay) return;

    if (!enabled) {
      swiper.autoplay.stop();
      return;
    }

    if (typeof swiper.params.autoplay === "object") {
      swiper.params.autoplay.delay = delay;
      swiper.params.autoplay.disableOnInteraction = false;
      swiper.params.autoplay.pauseOnMouseEnter = true;
    } else {
      swiper.params.autoplay = {
        delay,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      };
    }

    swiper.autoplay.stop();
    swiper.autoplay.start();
  };

  useEffect(() => {
    swiperRef.current?.slideTo(0);
    setRealIndex(1);
  }, [wordList]);

  useEffect(() => {
    applyAutoplay(swiperRef.current, autoSlide, speed);
  }, [autoSlide, speed]);

  const slideActions = (
    <>
      <Button
        type="button"
        size="sm"
        variant={autoSlide ? "default" : "secondary"}
        className={
          autoSlide
            ? "h-8"
            : "h-8 bg-white/15 text-white hover:bg-white/25 hover:text-white"
        }
        onClick={() => setStoreData({ key: "autoSlide", value: !autoSlide })}
      >
        <i className={`fas ${autoSlide ? "fa-pause" : "fa-play"}`} aria-hidden />
        {t("word.autoSlide")}
      </Button>
      <div className="flex overflow-hidden rounded-lg border border-white/20">
        {SPEED_OPTIONS.map((opt) => {
          const active = Number(speed) === opt.value;
          return (
            <Button
              key={opt.value}
              type="button"
              size="sm"
              variant="ghost"
              className={cn(
                "h-8 rounded-none px-2.5 text-xs font-semibold text-white hover:bg-white/20 hover:text-white",
                active && "bg-white/25",
              )}
              onClick={() =>
                setStoreData({ key: "speed", value: opt.value })
              }
            >
              {t(opt.labelKey)}
            </Button>
          );
        })}
      </div>
    </>
  );

  if (isEmpty(wordList)) {
    return (
      <div className="app-panel mb-6 w-full">
        <div className="app-panel-header">
          <h6 className="text-lg font-bold">{t("word.slideTitle")}</h6>
        </div>
        <div className="app-panel-body flex min-h-64 items-center justify-center">
          <p className="text-sm text-[var(--muted-foreground)]">
            {t("word.slideEmpty")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <ModalFullScreen
      visible
      title={t("word.slideTitle")}
      navInfo={`${realIndex} / ${wordList.length}`}
      onChange={setFullScreen}
      actions={slideActions}
    >
      <Swiper
        className="w-full word-swiper"
        centeredSlides
        autoplay={
          autoSlide
            ? {
                delay: speed,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }
            : false
        }
        navigation
        modules={[Autoplay, Pagination, Navigation]}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          applyAutoplay(swiper, autoSlide, speed);
        }}
        onRealIndexChange={(swiper) => {
          setRealIndex(swiper.realIndex + 1);
        }}
      >
        {wordList.map((wordInfo: any, index: number) => (
          <SwiperSlide key={index}>
            <WordCard
              fullScreen={isFullScreen}
              wordInfo={wordInfo}
              wordShowType={searchInfo.wordShowType}
              showDelay={showDelay}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </ModalFullScreen>
  );
};

export default WordContent;
