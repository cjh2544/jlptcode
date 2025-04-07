import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware';

type WordTodayNewInfoType = {
    level: string;
    year: string;
    wordNo: string;
    word: string;
    read: string; 
    means: string;
    sentence: string; 
    sentence_read: string;
    sentence_translate: string;
    question: any;
    showQuestion: boolean;
    hideWord: boolean,
    hideRead: boolean,
    hideMeans: boolean,
    hideSentence: boolean,
    hideSentenceRead: boolean
    hideSentenceTranslate: boolean,
}

type HeaderVisibleType = {
    [index: string]: boolean;
    word: boolean;
    read: boolean;
    means: boolean;
    sentence: boolean;
    sentence_read: boolean;
    sentence_translate: boolean;
}

interface WordTodayNewStore {
    wordTodayInfo: {
        level: string,
        levels: [],
        idx: number,
    },
    hideAll: HeaderVisibleType,
    wordTodayList: Array<WordTodayNewInfoType>,
    setWordTodayInfo: (wordTodayInfo: any) => void,
    setSpeakTodayInfo: (wordTodayInfo: any) => void,
    setWordTodayList: (wordTodayList: any) => void,
    setWordTodayAnswer: (selectedData: any) => void,
    getWordTodayList: () => void,
    getSpeakTodayList: () => void,
    setHideAllInfo: (headerVisibleInfo: HeaderVisibleType) => void,
    init: () => void,
}

export const useWordTodayNewStore = create<WordTodayNewStore>()(
    devtools(
        persist((set, get) => ({
            wordTodayInfo: {
                level: '',
                levels: [],
                idx: 0,
            },
            hideAll: {
                word: false,
                read: false,
                means: false,
                sentence: false,
                sentence_read: false,
                sentence_translate: false
            },
            wordTodayList: [],
            setWordTodayInfo: (wordTodayInfo) => set((state) => {
                state.wordTodayInfo = wordTodayInfo;
                state.getWordTodayList();
                return state;
            }),
            setSpeakTodayInfo: (wordTodayInfo) => set((state) => {
                state.wordTodayInfo = wordTodayInfo;
                state.getSpeakTodayList();
                return state;
            }),
            setWordTodayList: (wordTodayList: Array<any>) => set((state) => ({ wordTodayList: wordTodayList })),
            setWordTodayAnswer: (selectedData: any) => set((state) => {
                state.wordTodayList = state.wordTodayList.map((data: any) => {
                    if(data.questionNo === selectedData.questionNo) {
                        return {...data, selectedAnswer: selectedData.selectedAnswer}
                    } else {
                        return data
                    }
                });
                return state;
            }),
            getWordTodayList: async () => {
                const response = await fetch('/api/wordTodayNew/list', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({params: get().wordTodayInfo}),
                })
                const resData = await response.json();
                set({ 
                    wordTodayList: resData, 
                    hideAll: {
                        word: false,
                        read: false,
                        means: false,
                        sentence: false,
                        sentence_read: false,
                        sentence_translate: false
                    }
                });
            },
            getSpeakTodayList: async () => {
                const response = await fetch('/api/wordTodayNew/speakList', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({params: get().wordTodayInfo}),
                })
                const resData = await response.json();
                set({ 
                    wordTodayList: resData, 
                    hideAll: {
                        word: false,
                        read: false,
                        means: false,
                        sentence: false,
                        sentence_read: false,
                        sentence_translate: false
                    }
                });
            },
            setHideAllInfo: (headerVisibleInfo: HeaderVisibleType) => set((state) => ({
                hideAll: headerVisibleInfo,
                wordTodayList: state.wordTodayList.map((data) => {
                    data.hideWord = headerVisibleInfo.word;
                    data.hideRead = headerVisibleInfo.read;
                    data.hideMeans = headerVisibleInfo.means;

                    data.hideSentence = headerVisibleInfo.sentence;
                    data.hideSentenceRead = headerVisibleInfo.sentence_read;
                    data.hideSentenceTranslate = headerVisibleInfo.sentence_translate;
                    
                    return data;
                })
            })),
            init: () => set({ 
                wordTodayInfo: {
                    level: '',
                    levels: [],
                    idx: 0,
                },
                wordTodayList: [],
                hideAll: {
                    word: false,
                    read: false,
                    means: false,
                    sentence: false,
                    sentence_read: false,
                    sentence_translate: false
                },
            }),
        }),
        {
          name: 'wordtoday-storage-new', // persist key
        }
      )
    )
  );