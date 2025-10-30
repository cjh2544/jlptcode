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
    hideSpeaker: boolean,
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
    speaker: boolean,
}

interface SentenceTodayStore {
    wordTodayInfo: {
        level: string,
        levels: string[],
        idx: number,
    },
    hideAll: HeaderVisibleType,
    wordTodayList: Array<SentenceTodayInfoType>,
    setWordTodayInfo: (wordTodayInfo: any, isSearch?: boolean) => void,
    setWordTodayList: (wordTodayList: any) => void,
    setWordTodayAnswer: (selectedData: any) => void,
    getWordTodayList: () => void,
    getWordTodayAllList: () => void,
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
                speaker: false,
                keyword: false,
            },
            wordTodayList: [],
            // setWordTodayInfo: (wordTodayInfo, isSearch = true) => set((state:any) => {
            //     state.wordTodayInfo = wordTodayInfo;
            //     isSearch && state.getWordTodayList();
            //     return state;
            // }),
            setWordTodayInfo: (wordTodayInfo, isSearch = true) => {
                set(() => ({
                    wordTodayInfo: { ...wordTodayInfo },
                }));

                if (isSearch) get().getWordTodayList();
            },
            setWordTodayList: (wordTodayList: Array<any>) => set((state:any) => ({ wordTodayList: wordTodayList })),
            setWordTodayAnswer: (selectedData: any) => set((state:any) => {
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
                        speaker: false,
                        keyword: false
                    }
                });
            },
            getWordTodayAllList: async () => {
                const response = await fetch('/api/sentenceToday/listAll', {
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
                        speaker: false,
                        keyword: false
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
                    data.hideSpeaker = headerVisibleInfo.speaker;
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
                    speaker: false,
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