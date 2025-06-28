import CardWord from "@/app/components/Cards/CardWord"
import HeaderListButton from "./headerListButton"
import { useWordStore } from "@/app/store/wordStore";

type WordListProps = {
  title?: string,
  data: Array<Word> | undefined,
  className?: string,
}

const WordList = ({title, data, className}: WordListProps) => {
  const wordList = useWordStore((state:any) => state.wordList);
  const setWordList = useWordStore((state:any) => state.setWordList);

  const handleClickVisible = (wordInfo: any, rowNum: number) => {
    setWordList(
      wordList.map((item, idx) => idx === rowNum ? {...item, ...wordInfo} : item)
    );
  }
  
  return (
    <div className={`flex flex-wrap mt-4 ${className}`}>
      <div className="w-full mb-4 px-4">
        <div
          className={
            "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded " +
            "bg-white"
          }
        >
          {title && (
            <div className="rounded-t mb-0 px-4 py-3 border-0">
              <div className="flex flex-wrap items-center">
                <div className="relative w-full px-4 max-w-full flex justify-between items-center">
                  <h3
                    className={
                      "font-semibold text-lg " +
                      "text-blueGray-700"
                    }
                  >
                    {title}
                  </h3>
                  <div className='flex flex-col'>
                    <HeaderListButton colName={'word'} />
                    <HeaderListButton colName={'read'} />
                    <HeaderListButton colName={'means'} />
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="block w-full overflow-x-auto"></div>
          <ul className="divide-y divide-gray-200">
            {data && data.map((item, index) => <CardWord className={`${index % 2 === 0 ? 'bg-blue-gray-50/50' : ''}`} key={`word-${index}`} data={item} onClick={(data: any) => handleClickVisible(data, index)} />)}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default WordList