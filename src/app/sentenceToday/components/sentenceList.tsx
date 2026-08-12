'use client';
import { useSentenceTodayStore } from '@/app/store/sentenceTodayStore';
import SentenceInfo from './sentenceInfo';
import HeaderButton from './headerButton';
import { useTranslations } from '@/app/providers/I18nProvider';

type SentenceListProps = {
  className?: string,
}

const SentenceList = ({className}: SentenceListProps) => {
  const { t } = useTranslations();
  const wordTodayList = useSentenceTodayStore((state:any) => state.wordTodayList);
  const setWordTodayList = useSentenceTodayStore((state:any) => state.setWordTodayList);

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
            <HeaderButton colName="sentence" label={t('common.sentence')} />
            <HeaderButton colName="sentence_read" label={t('common.read')} />
            <HeaderButton colName="sentence_translate" label={t('common.translation')} />
          </div>
        </div>
        <div className="app-panel-body">
          <div className="app-today-list">
            {wordTodayList.map((item: any, index: number) => (
              <SentenceInfo
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

export default SentenceList
