'use client';
import { useSpeakTodayStore } from '@/app/store/speakTodayStore';
import SpeakInfo from './SpeakInfo';
import SpeakHeaderButton from './SpeakHeaderButton';
import { memo } from 'react';
import { useTranslations } from '@/app/providers/I18nProvider';

type SpeakListProps = {
  className?: string;
};

const SpeakList = ({ className }: SpeakListProps) => {
  const { t } = useTranslations();
  const wordTodayList = useSpeakTodayStore((state) => state.wordTodayList);
  const setWordTodayList = useSpeakTodayStore((state) => state.setSpeakTodayList);

  const handleClickVisible = (wordInfo: any, rowNum: number) => {
    setWordTodayList(
      wordTodayList.map((item: any, idx: number) =>
        idx === rowNum ? { ...item, ...wordInfo } : item,
      ),
    );
  };

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
            <SpeakHeaderButton colName="keyword" label={t('common.keyword')} />
            <SpeakHeaderButton colName="sentence" label={t('common.sentence')} />
            <SpeakHeaderButton colName="sentence_read" label={t('common.read')} />
            <SpeakHeaderButton colName="speak" label={t('common.play')} />
          </div>
        </div>
        <div className="app-panel-body">
          <div className="app-today-list">
            {wordTodayList.map((item: any, index: number) => (
              <SpeakInfo
                key={item._id ?? index}
                wordInfo={item}
                onClick={(data: any) => handleClickVisible(data, index)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(SpeakList);
