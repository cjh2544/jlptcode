'use client';
import HeaderButton from "./headerButton";
import WordInfo from "./wordInfo";
import { useWordStore } from "@/app/store/wordStore";
import { useTranslations } from '@/app/providers/I18nProvider';

type WordListProps = {
  title?: string,
  data: Array<Word> | undefined,
  className?: string,
}

const WordList = ({title, data, className}: WordListProps) => {
  const { t } = useTranslations();
  const wordList = useWordStore((state:any) => state.wordList);
  const pageInfo = useWordStore((state:any) => state.pageInfo);
  const setWordList = useWordStore((state:any) => state.setWordList);

  const handleClickVisible = (wordInfo: any, rowNum: number) => {
    setWordList(
      wordList.map((item: any, idx: number) => idx === rowNum ? {...item, ...wordInfo} : item)
    );
  }

  const items = data ?? [];
  const count = pageInfo?.total || items.length;
  const pageOffset = ((pageInfo?.currentPage || 1) - 1) * (pageInfo?.pageSize || items.length || 0);

  return (
    <div className={`mx-4 mb-8 ${className ?? ''}`}>
      <div className="app-panel">
        <div className="app-today-toolbar">
          <div className="flex flex-wrap items-center gap-2">
            {title && <h3 className="text-sm font-bold text-foreground">{title}</h3>}
            <p className="app-today-toolbar-count">
              {t('today.itemCount').replace('{n}', String(count))}
            </p>
          </div>
          <div className="app-today-toolbar-actions">
            <HeaderButton colName="word" label={t('word.word')} />
            <HeaderButton colName="read" label={t('word.reading')} />
            <HeaderButton colName="means" label={t('word.meaning')} />
          </div>
        </div>
        <div className="app-panel-body">
          {items.length === 0 ? (
            <p className="app-today-empty">{t('common.noData')}</p>
          ) : (
            <div className="app-today-list">
              {items.map((wordInfo: any, idx: number) => (
                <WordInfo
                  key={wordInfo._id ?? idx}
                  wordInfo={wordInfo}
                  index={idx}
                  displayNo={pageOffset + idx + 1}
                  onClick={(next: any) => handleClickVisible(next, idx)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default WordList
