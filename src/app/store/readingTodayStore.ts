import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware';

type ReadingTodayInfoType = {
    level: string;
    source: string;
    sort: number;
    sentence: string; 
    sentence_read: string;
    sentence_translate: string;
    hideSentence: boolean,
    hideSentenceRead: boolean
    hideSentenceTranslate: boolean,
}

type HeaderVisibleType = {
    [index: string]: boolean;
    sentence: boolean;
    sentence_read: boolean;
    sentence_translate: boolean;
}

interface ReadingTodayStore {
    readingTodayInfo: {
        level: string,
        idx: number,
    },
    hideAll: HeaderVisibleType,
    readingTodayList: Array<ReadingTodayInfoType>,
    setReadingTodayInfo: (readingTodayInfo: any) => void,
    setReadingTodayList: (readingTodayList: any) => void,
    getReadingTodayList: () => void,
    setHideAllInfo: (headerVisibleInfo: HeaderVisibleType) => void,
    init: () => void,
}

export const useReadingTodayStore = create<ReadingTodayStore>()(
    devtools(
        persist((set, get) => ({
            readingTodayInfo: {
                level: '',
                idx: 0,
            },
            hideAll: {
                sentence: false,
                sentence_read: false,
                sentence_translate: false,
            },
            readingTodayList: [],
            setReadingTodayInfo: (readingTodayInfo) => set((state) => {
                state.readingTodayInfo = readingTodayInfo;
                state.getReadingTodayList();
                return state;
            }),
            setReadingTodayList: (readingTodayList: Array<any>) => set((state) => ({ readingTodayList: readingTodayList })),
            getReadingTodayList: async () => {
                const response = await fetch('/api/readingToday/list', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({params: get().readingTodayInfo}),
                })
                const resData = await response.json();
                set({ 
                    readingTodayList: resData.map((item:any) => ({
                        ...item, 
                        hideSentence: false,
                        hideSentenceRead: true,
                        hideSentenceTranslate: true
                    })), 
                    hideAll: {
                        sentence: false,
                        sentence_read: false,
                        sentence_translate: false,
                    }
                });
            },
            setHideAllInfo: (headerVisibleInfo: HeaderVisibleType) => set((state) => ({
                hideAll: headerVisibleInfo,
                readingTodayList: state.readingTodayList.map((data) => {
                    data.hideSentence = headerVisibleInfo.sentence;
                    data.hideSentenceRead = headerVisibleInfo.sentence_read;
                    data.hideSentenceTranslate = headerVisibleInfo.sentence_translate;
                    
                    return data;
                })
            })),
            init: () => set({ 
                readingTodayInfo: {
                    level: '',
                    idx: 0,
                },
                readingTodayList: [],
                hideAll: {
                    sentence: false,
                    sentence_read: false,
                    sentence_translate: false,
                },
            }),
        }),
        {
          name: 'readingtoday-storage', // persist key
        }
      )
    )
  );