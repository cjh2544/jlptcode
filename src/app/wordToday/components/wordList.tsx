'use client';
import { useWordTodayStore } from '@/app/store/wordTodayStore';
import { Button, Card, Typography } from "@material-tailwind/react";
import WordInfo from './wordInfo';
import { Suspense } from 'react';

type WordListProps = {
  className?: string,
}

const TABLE_HEAD = [
  { label: "出題年度", visibleBtn: false },
  { label: "番号", visibleBtn: false },
  { label: "単語", visibleBtn: true, code: 'word' },
  { label: "読み方", visibleBtn: true, code: 'read' },
  { label: "意味", visibleBtn: true, code: 'means' },
  { label: "出題問題", visibleBtn: false },
  // <h6 className="flex justify-between items-center"><label>単語</label><Button className='p-0 text-blue-600 focus:outline-none' variant="text"><i className={`${hideWord ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash'}`}></i></Button></h6>, 
  // <h6 className="flex justify-between items-center"><label>読み方</label><Button className='p-0 text-blue-600 focus:outline-none' variant="text">[全体を隠す]</Button></h6>, 
  // <h6 className="flex justify-between items-center"><label>意味</label><Button className='p-0 text-blue-600 focus:outline-none' variant="text">[全体を隠す]</Button></h6>, 
  "出題問題"]
  ;

const WordList = ({className}: WordListProps) => {
  const { wordTodayList, hideAll, setWordTodayList, setHideAllInfo } = useWordTodayStore((state) => state);
  const { word, read, means } = hideAll;

  const handleClickVisible = (wordInfo: any, rowNum: number) => {
    setWordTodayList(
      wordTodayList.map((item, idx) => idx === rowNum ? {...item, ...wordInfo} : item)
    );
  }

  const handleClickHeader = (headType: string) => {
    let visibleInfo = {};

    if('word' === headType) {
      visibleInfo = { word: !hideAll.word };
    } else if('read' === headType) {
      visibleInfo = { read: !hideAll.read };
    } else if('means' === headType) {
      visibleInfo = { means: !hideAll.means };
    }

    setHideAllInfo({...visibleInfo});
  }

  return (
    <div className={`mx-4 ${className}`}>
      <Card className="h-full w-full overflow-scroll">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head: any, idx) => (
                <th key={idx} className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                  <div className="text-sm font-normal flex justify-between items-center">
                    <label>{head?.label}</label>
                    {head.visibleBtn && (
                      <>
                        {'word' === head?.code && (
                          <Button onClick={(e) => handleClickHeader('word')} className='p-0 text-blue-600 focus:outline-none' variant="text">
                            <i className={`${word ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash'}`}></i>
                          </Button>
                        )}
                        {'read' === head?.code && (
                          <Button onClick={(e) => handleClickHeader('read')} className='p-0 text-blue-600 focus:outline-none' variant="text">
                            <i className={`${read ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash'}`}></i>
                          </Button>
                        )}
                        {'means' === head?.code && (
                          <Button onClick={(e) => handleClickHeader('means')} className='p-0 text-blue-600 focus:outline-none' variant="text">
                            <i className={`${means ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash'}`}></i>
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                  {/* <div
                    className="text-sm font-normal leading-none"
                  >
                    {head}
                  </div> */}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {wordTodayList.map((item, index) => (
              <WordInfo key={index} wordInfo={item} onClick={(data: any) => handleClickVisible(data, index)} />
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}

export default WordList