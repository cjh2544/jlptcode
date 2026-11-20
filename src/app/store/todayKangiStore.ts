import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type TodayKangiInfoType = {
  level: string;
  sortNo: number;
  word: string;
  image: string;
  hideWord: boolean;
  hideImage: boolean;
};

type HeaderVisibleType = {
  [index: string]: boolean;
  word: boolean;
  image: boolean;
};

interface TodayKangiStore {
  todayKangiInfo: {
    level: string;
    study: string;
  };
  hideAll: HeaderVisibleType;
  todayKangiList: Array<TodayKangiInfoType>;
  setTodayKangiInfo: (info: any, isSearch?: boolean) => void;
  setTodayKangiList: (list: any) => void;
  getTodayKangiList: () => void;
  getTodayKangiAllList: () => void;
  setHideAllInfo: (headerVisibleInfo: HeaderVisibleType) => void;
  init: () => void;
}

const defaultHideAll: HeaderVisibleType = {
  word: false,
  image: false,
};

export const useTodayKangiStore = create<TodayKangiStore>()(
  devtools(
    persist(
      (set, get) => ({
        todayKangiInfo: {
          level: "",
          study: "",
        },
        hideAll: { ...defaultHideAll },
        todayKangiList: [],
        setTodayKangiInfo: (todayKangiInfo, isSearch = true) => {
          set(() => ({
            todayKangiInfo: { ...todayKangiInfo },
          }));
          if (isSearch) get().getTodayKangiList();
        },
        setTodayKangiList: (todayKangiList: Array<any>) =>
          set(() => ({ todayKangiList })),
        getTodayKangiList: async () => {
          const response = await fetch("/api/todayKangi/list", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ params: get().todayKangiInfo }),
          });
          const resData = await response.json();
          set({
            todayKangiList: resData,
            hideAll: { ...defaultHideAll },
          });
        },
        getTodayKangiAllList: async () => {
          const response = await fetch("/api/todayKangi/listAll", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ params: get().todayKangiInfo }),
          });
          const resData = await response.json();
          set({
            todayKangiList: resData,
            hideAll: { ...defaultHideAll },
          });
        },
        setHideAllInfo: (headerVisibleInfo: HeaderVisibleType) =>
          set((state) => ({
            hideAll: headerVisibleInfo,
            todayKangiList: state.todayKangiList.map((data: any) => ({
              ...data,
              hideWord: headerVisibleInfo.word,
              hideImage: headerVisibleInfo.image,
            })),
          })),
        init: () =>
          set({
            todayKangiInfo: { level: "", study: "" },
            todayKangiList: [],
            hideAll: { ...defaultHideAll },
          }),
      }),
      { name: "todaykangi-storage" },
    ),
  ),
);
