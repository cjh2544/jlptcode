"use client";
import { useTodayKangiStore } from "@/app/store/todayKangiStore";
import KangiInfo from "./kangiInfo";
import HeaderButton from "./headerButton";
import { useTranslations } from "@/app/providers/I18nProvider";

type KangiListProps = {
  className?: string;
};

const KangiList = ({ className }: KangiListProps) => {
  const { t } = useTranslations();
  const todayKangiList = useTodayKangiStore((state) => state.todayKangiList);
  const setTodayKangiList = useTodayKangiStore(
    (state) => state.setTodayKangiList,
  );

  const handleClickVisible = (kangiInfo: any, rowNum: number) => {
    setTodayKangiList(
      todayKangiList.map((item: any, idx: number) =>
        idx === rowNum ? { ...item, ...kangiInfo } : item,
      ),
    );
  };

  if (todayKangiList.length === 0) return null;

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
              String(todayKangiList.length),
            )}
          </p>
          <div className="app-today-toolbar-actions">
            <HeaderButton colName="word" label={t("common.kangi")} />
            <HeaderButton colName="image" label={t("common.image")} />
          </div>
        </div>
        <div className="app-panel-body">
          <div className="app-today-list">
            {todayKangiList.map((item: any, index: number) => (
              <KangiInfo
                key={item._id ?? item.id ?? index}
                kangiInfo={item}
                onClick={(data: any) => handleClickVisible(data, index)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KangiList;
