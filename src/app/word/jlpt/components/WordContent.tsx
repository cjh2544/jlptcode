import useWord from '@/app/swr/useWord';
import WordTable from './WordTable';
import WordList from './WordList';
import { Suspense } from 'react';
import Loading from '@/app/components/Loading/loading';

type WordTableProps = {
  conditions: any,
}

const WordTableContent = (props: WordTableProps) => {

  const {
    conditions
  } = props

  const {data: words = [], isLoading, error} = useWord(conditions);

  // const {data: pageInfo} = useWordPage(conditions);

  // if (isLoading) {
  //   return <p>조회중...</p>;
  // }

  return (
    <>
      <div className='xs:hidden sm:hidden'>
        <WordTable title='JLPT 단어외우기' data={words} />
      </div>
      <div className='md:hidden lg:hidden xl:hidden 2xl:hidden'>
        <Suspense fallback={<Loading />}>
          <WordList title='JLPT 단어외우기' data={words} />
        </Suspense>
      </div>
    </>
  )
}

export default WordTableContent