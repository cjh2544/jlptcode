'use client'
import { useEffect, useRef, useState } from 'react';
// import useWord from '@/app/swr/useWord';
import { Button, Card, CardBody, Carousel, IconButton, Slider, Typography } from '@material-tailwind/react';
import { Swiper, SwiperRef, SwiperSlide, useSwiper } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// import required modules
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import WordCard from './WordCard';
import ModalFullScreen from '@/app/components/Modals/ModalFullScreen';
import { useWordStore } from '@/app/store/wordStore';
import { isEmpty } from 'lodash';

type WordTableProps = {
  conditions?: any,
}

const WordContent = (props: WordTableProps) => {

  const [isFullScreen, setFullScreen] = useState<boolean>(false);
  const pageInfo = useWordStore((state) => state.pageInfo);
  const wordList = useWordStore((state) => state.wordList);
  const searchInfo =useWordStore((state) => state.searchInfo);
  const showDelay =useWordStore((state) => state.showDelay);
  const speed =useWordStore((state) => state.speed);
  const autoSlide =useWordStore((state) => state.autoSlide);
  const setStoreData =useWordStore((state) => state.setStoreData);
  const [realIndex, setRealIndex] = useState<number>(1);

  const swiperRef = useRef<any>();

  // init Swiper:
  const swiperOptions = {
    className: "w-full word-swiper",
    // spaceBetween={30}
    centeredSlides: true,
    autoplay: autoSlide ? {
      delay: speed,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    } : false,
    // pagination: {
    //   clickable: true,
    // },
    navigation: true,
    modules: [Autoplay, Pagination, Navigation],
    onSwiper: (swiper: any) => {
      swiperRef.current = swiper;
    },
    onRealIndexChange: (swiper: any) => {
      setRealIndex(swiper.realIndex + 1);
    },
    onSlideChange: (swiper: any) => {
      // swiperRef.current.slideNext()
    },
    onDestroy: (swiper: any) => {},
  }

  useEffect(() => {
    swiperRef.current.slideTo(0)
  }, [wordList])

  return (
    <>
      <ModalFullScreen visible={!isEmpty(wordList)}
        title={`단어암기`}
        navInfo={`${realIndex} / ${pageInfo?.pageSize}`}
        onChange={setFullScreen}>
        <Swiper {...swiperOptions}>
          {wordList && wordList.map((wordInfo: any, index: number) => {
            return (
              <SwiperSlide key={index}>
                <WordCard 
                  fullScreen={isFullScreen} 
                  wordInfo={wordInfo}
                  wordShowType={searchInfo.wordShowType}
                  showDelay={showDelay}
                />
              </SwiperSlide>
            )
          })}
        </Swiper>
      </ModalFullScreen>
    </>
  )
}

export default WordContent