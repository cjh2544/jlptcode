"use client";
import { useTodaySpeakStore } from "@/app/store/todaySpeakStore";
import SpeakInfo from "./speakInfo";
import HeaderButton from "./headerButton";
import { useTranslations } from "@/app/providers/I18nProvider";

type SpeakListProps = {
  className?: string;
};

const SpeakList = ({ className }: SpeakListProps) => {
  const { t } = useTranslations();
  const todaySpeakList = useTodaySpeakStore((state) => state.todaySpeakList);
  const setTodaySpeakList = useTodaySpeakStore(
    (state) => state.setTodaySpeakList,
  );

  const handleClickVisible = (speakInfo: any, rowNum: number) => {
    setTodaySpeakList(
      todaySpeakList.map((item: any, idx: number) =>
        idx === rowNum ? { ...item, ...speakInfo } : item,
      ),
    );
  };

  if (todaySpeakList.length === 0) return null;

  return (
    <div
      className={`mx-4 mb-8 ${className ?? ""}`}
      onContextMenu={(e) => e.preventDefault()}
      onMouseDown={(e) => e.preventDefault()}
    >
      <div className="app-panel">
        <div className="app-today-toolbar">
          <p className="app-today-toolbar-count">
            {t("today.itemCount").replace(
              "{n}",
              String(todaySpeakList.length),
            )}
          </p>
          <div className="app-today-toolbar-actions">
            <HeaderButton colName="sentence" label={t("common.sentence")} />
            <HeaderButton colName="sentence_read" label={t("common.read")} />
            <HeaderButton colName="keyword" label={t("common.keyword")} />
            <HeaderButton
              colName="sentence_translate"
              label={t("common.translation")}
            />
            <HeaderButton colName="word" label={t("common.word")} />
            <HeaderButton colName="speak" label={t("common.play")} />
          </div>
        </div>
        <div className="app-panel-body">
          <div className="app-today-list">
            {todaySpeakList.map((item: any, index: number) => (
              <SpeakInfo
                key={item._id ?? item.id ?? index}
                speakInfo={item}
                onClick={(data: any) => handleClickVisible(data, index)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeakList;
