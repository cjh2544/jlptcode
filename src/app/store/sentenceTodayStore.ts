import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware';

type SentenceTodayInfoType = {
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
    question: any;
    showQuestion: boolean;
    hideWord: boolean,
    hideRead: boolean,
    hideMeans: boolean,
    hideSentence: boolean,
    hideSentenceRead: boolean
    hideSentenceTranslate: boolean,
    hideKeyword: boolean,
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
}

interface SentenceTodayStore {
    wordTodayInfo: {
        level: string,
        levels: string[],
        idx: number,
    },
    hideAll: HeaderVisibleType,
    wordTodayList: Array<SentenceTodayInfoType>,
    setWordTodayInfo: (wordTodayInfo: any) => void,
    setWordTodayList: (wordTodayList: any) => void,
    setWordTodayAnswer: (selectedData: any) => void,
    getWordTodayList: () => void,
    setHideAllInfo: (headerVisibleInfo: HeaderVisibleType) => void,
    init: () => void,
}

export const useSentenceTodayStore = create<SentenceTodayStore>()(
    devtools(
        persist((set, get) => ({
            wordTodayInfo: {
                level: '',
                levels: ['N5'],
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
            },
            wordTodayList: [],
            setWordTodayInfo: (wordTodayInfo) => set((state) => {
                state.wordTodayInfo = wordTodayInfo;
                state.getWordTodayList();
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
                const response = await fetch('/api/sentenceToday/list', {
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
                        sentence_translate: false,
                        keyword: false
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
                    data.hideKeyword = headerVisibleInfo.keyword;
                    
                    return data;
                })
            })),
            init: () => set({ 
                wordTodayInfo: {
                    level: '',
                    levels: ['N5'],
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
                    keyword: false
                },
            }),
        }),
        {
          name: 'sentencetoday-storage', // persist key
        }
      )
    )
  );