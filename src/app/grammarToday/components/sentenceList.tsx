'use client';
import { useGrammarTodayStore } from '@/app/store/grammarTodayStore';
import { Card } from "@material-tailwind/react";
import SentenceInfo from './sentenceInfo';
import HeaderButton from './headerButton';

type SentenceListProps = {
  className?: string,
}

const TABLE_HEAD = [
  { label: "STUDY", visibleBtn: false },
  { label: "番号", visibleBtn: false },
  { label: "文章", visibleBtn: true },
  // { label: "出題問題", visibleBtn: false },
];

const SentenceList = ({className}: SentenceListProps) => {
  const grammarTodayList = useGrammarTodayStore((state) => state.grammarTodayList);
  const setGrammarTodayList = useGrammarTodayStore((state) => state.setGrammarTodayList);
  
  const handleClickVisible = (wordInfo: any, rowNum: number) => {
    setGrammarTodayList(
      grammarTodayList.map((item, idx) => idx === rowNum ? {...item, ...wordInfo} : item)
    );
  }

  return (
    <div className={`mx-4 ${className}`} onContextMenu={(e) => e.preventDefault()} onMouseDown={(e) => e.preventDefault()}>
      <Card className="h-full w-full overflow-scroll">
        <table className="w-full table-auto text-left">
          <colgroup>
            <col className='sm:w-2/12 lg:w-2/12 w-1/12' />
            <col className='sm:w-2/12 lg:w-1/12 w-1/12' />
            <col />
            {/* <col className='sm:w-2/12 lg:w-2/12 w-1/12' /> */}
          </colgroup>
          <thead>
            <tr>
              {TABLE_HEAD.map((head: any, idx) => (
                <th key={idx} className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                  <div className="text-sm font-normal flex justify-between items-center">
                    <p>{head?.label}</p>
                    {head.visibleBtn && (
                      <div className='flex flex-col'>
                        <HeaderButton colName={'sentence'} />
                        <HeaderButton colName={'sentence_read'} />
                        <HeaderButton colName={'sentence_translate'} />
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {grammarTodayList.map((item, index) => (
              <SentenceInfo key={index} sentenceInfo={item} onClick={(data: any) => handleClickVisible(data, index)} />
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}

export default SentenceList