import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware';

type SpeakTodayInfoType = {
    level: string;
    year: string;
    wordNo: string;
    word: string;
    read: string; 
    means: string;
    keyword: string;
    sentence: string; 
    sentence_read: string;
    sentence_translate: string;
    speaker: string,
    question: any;
    showQuestion: boolean;
    hideWord: boolean,
    hideRead: boolean,
    hideMeans: boolean,
    hideSentence: boolean,
    hideSentenceRead: boolean
    hideSentenceTranslate: boolean,
    hideKeyword: boolean,
    hideSpeaker: boolean,
}

type HeaderVisibleType = {
    [index: string]: boolean;
    word: boolean;
    read: boolean;
    means: boolean;
    keyword: boolean;
    sentence: boolean;
    sentence_read: boolean;
    sentence_translate: boolean;
    speak: boolean;
}

interface SpeakTodayStore {
    wordTodayInfo: {
        level: string,
        levels: string[],
        study: string,
        idx: number,
    },
    hideAll: HeaderVisibleType,
    wordTodayList: Array<SpeakTodayInfoType>,
    setSpeakTodayInfo: (wordTodayInfo: any, isSearch?: boolean) => void,
    setSpeakTodayList: (wordTodayList: any) => void,
    getSpeakTodayList: () => void,
    getSpeakTodayAllList: () => void,
    setHideAllInfo: (headerVisibleInfo: HeaderVisibleType) => void,
    init: () => void,
}

export const useSpeakTodayStore = create<SpeakTodayStore>()(
    devtools(
        persist((set, get) => ({
            wordTodayInfo: {
                level: 'N5',
                levels: ['N5'],
                study: '',
                idx: 0,
            },
            hideAll: {
                word: false,
                read: false,
                means: false,
                sentence: false,
                sentence_read: false,
                sentence_translate: false,
                keyword: false,
                speak: false,
            },
            wordTodayList: [],
            // setSpeakTodayInfo: (wordTodayInfo, isSearch = true) => set((state:any) => {
            //     state.wordTodayInfo = wordTodayInfo;
            //     isSearch && state.getSpeakTodayList();
            //     return state;
            // }),
            setSpeakTodayInfo: (wordTodayInfo, isSearch = true) => {
                set(() => ({
                    wordTodayInfo: { ...wordTodayInfo },
                }));

                if (isSearch) get().getSpeakTodayList();
            },
            setSpeakTodayList: (wordTodayList: Array<any>) => set((state:any) => ({ wordTodayList: wordTodayList })),
            getSpeakTodayList: async () => {
                const response = await fetch('/api/speakToday/list', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({params: get().wordTodayInfo}),
                })
                const resData = await response.json();
                set({ 
                    wordTodayList: resData.map((item: SpeakTodayInfoType) => ({
                        ...item,
                        hideSentence: true,
                        hideSentenceRead: true,
                        hideSentenceTranslate: false,
                        hideKeyword: true,
                        hideSpeaker: true,
                    })), 
                    hideAll: {
                        word: false,
                        read: false,
                        means: false,
                        sentence: true,
                        sentence_read: true,
                        sentence_translate: false,
                        keyword: true,
                        speak: true
                    }
                });
            },
            getSpeakTodayAllList: async () => {
                const response = await fetch('/api/speakToday/listAll', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({params: get().wordTodayInfo}),
                })
                const resData = await response.json();
                set({ 
                    wordTodayList: resData.map((item: SpeakTodayInfoType) => ({
                        ...item,
                        hideSentence: true,
                        hideSentenceRead: true,
                        hideSentenceTranslate: false,
                        hideKeyword: true,
                        hideSpeaker: true,
                    })), 
                    hideAll: {
                        word: false,
                        read: false,
                        means: false,
                        sentence: true,
                        sentence_read: true,
                        sentence_translate: false,
                        keyword: true,
                        speak: true,
                    }
                });
            },
            setHideAllInfo: (headerVisibleInfo: HeaderVisibleType) => set((state:any) => ({
                hideAll: headerVisibleInfo,
                wordTodayList: state.wordTodayList.map((data: any) => {
                    data.hideWord = headerVisibleInfo.word;
                    data.hideRead = headerVisibleInfo.read;
                    data.hideMeans = headerVisibleInfo.means;

                    data.hideSentence = headerVisibleInfo.sentence;
                    data.hideSentenceRead = headerVisibleInfo.sentence_read;
                    data.hideSentenceTranslate = headerVisibleInfo.sentence_translate;
                    data.hideKeyword = headerVisibleInfo.keyword;
                    data.hideSpeaker = headerVisibleInfo.speak;
                    
                    return data;
                })
            })),
            init: () => set({ 
                wordTodayInfo: {
                    level: 'N5',
                    levels: ['N5'],
                    study: '',
                    idx: 0,
                },
                wordTodayList: [],
                hideAll: {
                    word: false,
                    read: false,
                    means: false,
                    sentence: false,
                    sentence_read: false,
                    sentence_translate: false,
                    keyword: false,
                    speak: false,
                },
            }),
        }),
        {
          name: 'speaktoday-storage', // persist key
        }
      )
    )
  );