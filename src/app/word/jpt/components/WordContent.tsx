import WordTable from './WordTable';
import WordList from './WordList';
import { useJptWordStore } from '@/app/store/jptWordStore';
import { useTranslations } from '@/app/providers/I18nProvider';

type WordTableProps = {
  conditions: any,
}

const WordTableContent = (props: WordTableProps) => {
  const { t } = useTranslations();

  const {
    conditions
  } = props

  const wordList = useJptWordStore((state:any) => state.wordList);

  return (
    <>
      <div className="hidden md:block">
        <WordTable title={t('word.jptTitle')} data={wordList} />
      </div>
      <div className="md:hidden">
        <WordList title={t('word.jptTitle')} data={wordList} />
      </div>
    </>
  )
}

export default WordTableContent