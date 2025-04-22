'use client';
import { useReadingTodayStore } from '@/app/store/readingTodayStore';
import { Card } from "@material-tailwind/react";
import SentenceInfo from './sentenceInfo';
import HeaderButton from './headerButton';

type SentenceListProps = {
  className?: string,
}

const TABLE_HEAD = [
  { label: "出題年度", visibleBtn: false },
  { label: "番号", visibleBtn: false },
  { label: "文章", visibleBtn: true },
  { label: "出題問題", visibleBtn: false },
];

const SentenceList = ({className}: SentenceListProps) => {
  const readingTodayList = useReadingTodayStore((state) => state.readingTodayList);
  const setReadingTodayList = useReadingTodayStore((state) => state.setReadingTodayList);
  
  const handleClickVisible = (wordInfo: any, rowNum: number) => {
    setReadingTodayList(
      readingTodayList.map((item, idx) => idx === rowNum ? {...item, ...wordInfo} : item)
    );
  }

  return readingTodayList.length === 0 ? <></> : (
    <div className={`mx-4 ${className}`} onContextMenu={(e) => e.preventDefault()} onMouseDown={(e) => e.preventDefault()}>
      <Card className="h-full w-full bg-white p-4">
        {readingTodayList.map((item, index) => (
          <SentenceInfo key={index} readingInfo={item} onClick={(data: any) => handleClickVisible(data, index)} />
        ))}
      </Card>
    </div>
  )
}

export default SentenceList