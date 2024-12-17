'use client'
import { useState } from 'react';
// import useWord from '@/app/swr/useWord';
import { Button, Card, CardBody, Carousel, IconButton, Typography } from '@material-tailwind/react';
import { Swiper, SwiperSlide } from 'swiper/react';

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
  const wordList = useWordStore((state) => state.wordList);

  return (
    <>
      <ModalFullScreen visible={!isEmpty(wordList)} title='단어암기' onChange={setFullScreen}>
        <Swiper
          // spaceBetween={30}
          centeredSlides={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          pagination={{
            clickable: true,
          }}
          navigation={true}
          modules={[Autoplay, Pagination, Navigation]}
          className="w-full"
        >
          {wordList && wordList.map((wordInfo: any, index: number) => {
            return (
              <SwiperSlide key={index}><WordCard fullScreen={isFullScreen} wordInfo={wordInfo} /></SwiperSlide>
            )
          })}
        </Swiper>
      </ModalFullScreen>
    </>
  )
}

export default WordContent