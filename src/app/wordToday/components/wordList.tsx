import { useWordTodayStore } from '@/app/store/wordTodayStore';
import { Button, Card, Typography } from "@material-tailwind/react";
import WordInfo from './wordInfo';

type WordListProps = {
  className?: string,
}

const TABLE_HEAD = [
  "出題年度", 
  "番号", 
  <div className="flex justify-between items-center"><p>単語</p><p><Button className='p-0 text-blue-600 focus:outline-none' variant="text">[全体を隠す]</Button></p></div>, 
  <div className="flex justify-between items-center"><p>読み方</p><p><Button className='p-0 text-blue-600 focus:outline-none' variant="text">[全体を隠す]</Button></p></div>, 
  <div className="flex justify-between items-center"><p>意味</p><p><Button className='p-0 text-blue-600 focus:outline-none' variant="text">[全体を隠す]</Button></p></div>, 
  "出題問題"]
  ;

const WordList = ({className}: WordListProps) => {
  const { wordTodayList } = useWordTodayStore((state) => state);

  return (
    <div className={`mx-4 ${className}`}>
      <Card className="h-full w-full overflow-scroll">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head, idx) => (
                <th key={idx} className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {wordTodayList.map((item, index) => (
              <WordInfo wordInfo={item} />
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}

export default WordList