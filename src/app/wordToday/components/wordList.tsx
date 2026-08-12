'use client';
import { useWordTodayStore } from '@/app/store/wordTodayStore';
import WordInfo from './wordInfo';
import HeaderButton from './headerButton';
import { useTranslations } from '@/app/providers/I18nProvider';

type WordListProps = {
  className?: string,
}

const WordList = ({className}: WordListProps) => {
  const { t } = useTranslations();
  const wordTodayList = useWordTodayStore((state:any) => state.wordTodayList);
  const setWordTodayList = useWordTodayStore((state:any) => state.setWordTodayList);

  const handleClickVisible = (wordInfo: any, rowNum: number) => {
    setWordTodayList(
      wordTodayList.map((item: any, idx: number) => idx === rowNum ? {...item, ...wordInfo} : item)
    );
  }

  if (wordTodayList.length === 0) return null;

  return (
    <div
      className={`mx-4 mb-8 ${className ?? ''}`}
      onContextMenu={(e) => e.preventDefault()}
      onMouseDown={(e) => e.preventDefault()}
    >
      <div className="app-panel">
        <div className="app-today-toolbar">
          <p className="app-today-toolbar-count">
            {t('today.itemCount').replace('{n}', String(wordTodayList.length))}
          </p>
          <div className="app-today-toolbar-actions">
            <HeaderButton colName="word" label={t('word.word')} />
            <HeaderButton colName="read" label={t('word.reading')} />
            <HeaderButton colName="means" label={t('word.meaning')} />
          </div>
        </div>
        <div className="app-panel-body">
          <div className="app-today-list">
            {wordTodayList.map((item: any, index: number) => (
              <WordInfo
                key={item._id ?? index}
                wordInfo={item}
                onClick={(data: any) => handleClickVisible(data, index)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default WordList
