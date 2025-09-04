import WordTable from './WordTable';
import WordList from './WordList';
import { useJptWordStore } from '@/app/store/jptWordStore';

type WordTableProps = {
  conditions: any,
}

const WordTableContent = (props: WordTableProps) => {

  const {
    conditions
  } = props

  const wordList = useJptWordStore((state:any) => state.wordList);

  return (
    <>
      <div className='xs:hidden sm:hidden'>
        <WordTable title='JPT 단어외우기' data={wordList} />
      </div>
      <div className='md:hidden lg:hidden xl:hidden 2xl:hidden'>
        <WordList title='JPT 단어외우기' data={wordList} />
      </div>
    </>
  )
}

export default WordTableContent