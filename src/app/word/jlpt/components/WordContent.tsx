'use client';
import WordList from './WordList';
import { useWordStore } from '@/app/store/wordStore';
import { useTranslations } from '@/app/providers/I18nProvider';

type WordTableProps = {
  conditions: any,
}

const WordTableContent = (props: WordTableProps) => {
  const { t } = useTranslations();
  const wordList = useWordStore((state:any) => state.wordList);

  return (
    <WordList title={t('word.jlptTitle')} data={wordList} />
  )
}

export default WordTableContent
