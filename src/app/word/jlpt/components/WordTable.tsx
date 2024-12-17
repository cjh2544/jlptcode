import CardSentence from "@/app/components/Cards/CardSentence"
import HeaderButton from "./headerButton";
import WordInfo from "./wordInfo";
import { useWordStore } from "@/app/store/wordStore";

type WordTableProps = {
  title?: string,
  data: Array<Word> | undefined,
  className?: string,
}

const TABLE_HEAD = [
  { label: "단어", visibleBtn: true, code: 'word' },
  { label: "읽기", visibleBtn: true, code: 'read' },
  { label: "뜻", visibleBtn: true, code: 'means' },
];

const WordTable = ({title, data, className}: WordTableProps) => {
  const wordList = useWordStore((state) => state.wordList);
  const setWordList = useWordStore((state) => state.setWordList);

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
                <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                  <h3
                    className={
                      "font-semibold text-lg " +
                      "text-blueGray-700"
                    }
                  >
                    {title}
                  </h3>
                </div>
              </div>
            </div>
          )}
          <div className="block w-full overflow-x-auto">
            <table className="items-center w-full bg-transparent border-collapse">
              <thead>
                <tr>
                  {TABLE_HEAD.map((head: any, idx) => (
                    <th key={idx} className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                      <div className="text-sm font-normal flex justify-between items-center">
                        <label>{head?.label}</label>
                        {head.visibleBtn && (
                          <HeaderButton colName={head.code} />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data && data.map((wordInfo, idx) => {
                  return <WordInfo key={idx} wordInfo={wordInfo} onClick={(data: any) => handleClickVisible(data, idx)} />
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WordTable