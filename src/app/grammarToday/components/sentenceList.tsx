'use client';
import { useGrammarTodayStore } from '@/app/store/grammarTodayStore';
import SentenceInfo from './sentenceInfo';
import HeaderButton from './headerButton';
import { useTranslations } from '@/app/providers/I18nProvider';

type SentenceListProps = {
  className?: string,
}

const SentenceList = ({className}: SentenceListProps) => {
  const { t } = useTranslations();
  const grammarTodayList = useGrammarTodayStore((state:any) => state.grammarTodayList);
  const setGrammarTodayList = useGrammarTodayStore((state:any) => state.setGrammarTodayList);

  const handleClickVisible = (wordInfo: any, rowNum: number) => {
    setGrammarTodayList(
      grammarTodayList.map((item:any, idx:number) => idx === rowNum ? {...item, ...wordInfo} : item)
    );
  }

  if (grammarTodayList.length === 0) return null;

  return (
    <div
      className={`mx-4 mb-8 ${className ?? ''}`}
      onContextMenu={(e) => e.preventDefault()}
      onMouseDown={(e) => e.preventDefault()}
    >
      <div className="app-panel">
        <div className="app-today-toolbar">
          <p className="app-today-toolbar-count">
            {t('today.itemCount').replace('{n}', String(grammarTodayList.length))}
          </p>
          <div className="app-today-toolbar-actions">
            <HeaderButton colName="sentence" label={t('common.sentence')} />
            <HeaderButton colName="sentence_read" label={t('common.read')} />
            <HeaderButton colName="sentence_translate" label={t('common.translation')} />
          </div>
        </div>
        <div className="app-panel-body">
          <div className="app-today-list">
            {grammarTodayList.map((item:any, index: number) => (
              <SentenceInfo
                key={item._id ?? index}
                sentenceInfo={item}
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
