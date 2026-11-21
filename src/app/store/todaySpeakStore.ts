import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type TodaySpeakInfoType = {
  sortNo: number;
  sentence: string;
  sentence_read: string;
  word: string;
  sentence_translate: string;
  sentence_locale?: { en?: string; cn?: string; my?: string };
  keyword: string;
  speaker: string;
  image: string;
  hideSentence: boolean;
  hideSentenceRead: boolean;
  hideKeyword: boolean;
  hideSentenceTranslate: boolean;
  hideWord: boolean;
  hideSpeaker: boolean;
};

type HeaderVisibleType = {
  [index: string]: boolean;
  sentence: boolean;
  sentence_read: boolean;
  keyword: boolean;
  sentence_translate: boolean;
  word: boolean;
  speak: boolean;
};

interface TodaySpeakStore {
  hideAll: HeaderVisibleType;
  todaySpeakList: Array<TodaySpeakInfoType>;
  setTodaySpeakList: (list: any) => void;
  getTodaySpeakList: () => void;
  getTodaySpeakAllList: () => void;
  setHideAllInfo: (headerVisibleInfo: HeaderVisibleType) => void;
  init: () => void;
}

const defaultHideAll: HeaderVisibleType = {
  sentence: true,
  sentence_read: true,
  keyword: true,
  sentence_translate: true,
  word: true,
  speak: false, // 재생 기본 노출
};

function withDefaultHides(list: any[]) {
  return list.map((item) => ({
    ...item,
    hideSentence: true,
    hideSentenceRead: true,
    hideKeyword: true,
    hideSentenceTranslate: true,
    hideWord: true,
    hideSpeaker: false,
  }));
}

export const useTodaySpeakStore = create<TodaySpeakStore>()(
  devtools(
    persist(
      (set, get) => ({
        hideAll: { ...defaultHideAll },
        todaySpeakList: [],
        setTodaySpeakList: (todaySpeakList: Array<any>) =>
          set(() => ({ todaySpeakList })),
        getTodaySpeakList: async () => {
          const response = await fetch("/api/todaySpeak/list", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ params: {} }),
          });
          const resData = await response.json();
          set({
            todaySpeakList: withDefaultHides(resData),
            hideAll: { ...defaultHideAll },
          });
        },
        getTodaySpeakAllList: async () => {
          const response = await fetch("/api/todaySpeak/listAll", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ params: {} }),
          });
          const resData = await response.json();
          set({
            todaySpeakList: withDefaultHides(resData),
            hideAll: { ...defaultHideAll },
          });
        },
        setHideAllInfo: (headerVisibleInfo: HeaderVisibleType) =>
          set((state) => ({
            hideAll: headerVisibleInfo,
            todaySpeakList: state.todaySpeakList.map((data: any) => ({
              ...data,
              hideSentence: headerVisibleInfo.sentence,
              hideSentenceRead: headerVisibleInfo.sentence_read,
              hideKeyword: headerVisibleInfo.keyword,
              hideSentenceTranslate: headerVisibleInfo.sentence_translate,
              hideWord: headerVisibleInfo.word,
              hideSpeaker: headerVisibleInfo.speak,
            })),
          })),
        init: () =>
          set({
            todaySpeakList: [],
            hideAll: { ...defaultHideAll },
          }),
      }),
      { name: "todayspeak-storage" },
    ),
  ),
);
