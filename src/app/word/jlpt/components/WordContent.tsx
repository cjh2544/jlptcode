import WordTable from './WordTable';
import WordList from './WordList';
import { useWordStore } from '@/app/store/wordStore';
import { useTranslations } from '@/app/providers/I18nProvider';

type WordTableProps = {
  conditions: any,
}

const WordTableContent = (props: WordTableProps) => {
  const { t } = useTranslations();

  const {
    conditions
  } = props

  const wordList = useWordStore((state:any) => state.wordList);

  return (
    <>
      <div className='xs:hidden sm:hidden'>
        <WordTable title={t('word.jlptTitle')} data={wordList} />
      </div>
      <div className='md:hidden lg:hidden xl:hidden 2xl:hidden'>
        <WordList title={t('word.jlptTitle')} data={wordList} />
      </div>
    </>
  )
}

export default WordTableContent