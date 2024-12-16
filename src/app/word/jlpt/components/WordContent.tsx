import WordTable from './WordTable';
import WordList from './WordList';
import { useWordStore } from '@/app/store/wordStore';

type WordTableProps = {
  conditions: any,
}

const WordTableContent = (props: WordTableProps) => {

  const {
    conditions
  } = props

  const wordList = useWordStore((state) => state.wordList);

  return (
    <>
      <div className='xs:hidden sm:hidden'>
        <WordTable title='JLPT 단어외우기' data={wordList} />
      </div>
      <div className='md:hidden lg:hidden xl:hidden 2xl:hidden'>
        <WordList title='JLPT 단어외우기' data={wordList} />
      </div>
    </>
  )
}

export default WordTableContent