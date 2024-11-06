import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware';

type WordTodayInfoType = {
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
    hideWord: boolean,
    hideRead: boolean,
    hideMeans: boolean
}

interface WordTodayStore {
    wordTodayInfo: {
        level: string,
    },
    hideAll: {
        word: boolean,
        read: boolean,
        means: boolean
    },
    wordTodayList: Array<WordTodayInfoType>,
    setWordTodayInfo: (wordTodayInfo: any) => void,
    setWordTodayList: (wordTodayList: any) => void,
    setWordTodayAnswer: (selectedData: any) => void,
    getWordTodayList: () => void,
    setHideAllInfo: (hideAllInfo: any) => void,
    init: () => void,
}

export const useWordTodayStore = create<WordTodayStore>()(
    devtools(
        persist((set, get) => ({
            wordTodayInfo: {
                level: '',
            },
            hideAll: {
                word: false,
                read: false,
                means: false
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
                const response = await fetch('/api/wordToday/list', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({params: get().wordTodayInfo}),
                })
                const resData = await response.json();
                set({ wordTodayList: resData });
            },
            setHideAllInfo: (hideAllInfo: any) => set((state) => {
                console.log(hideAllInfo);
                // state.hideAll = {...state.hideAll, ...hideAllInfo};
                // state.wordTodayList = state.wordTodayList.map((item, idx) => {
                //     if(hideAllInfo.word) item.hideWord = hideAllInfo.word;
                //     if(hideAllInfo.read) item.hideRead = hideAllInfo.read;
                //     if(hideAllInfo.means) item.hideMeans = hideAllInfo.means;

                //     return item;
                // });

                return state;
            }),
            init: () => set({ 
                wordTodayInfo: {
                    level: '',
                },
                wordTodayList: [],
                hideAll: {
                    word: false,
                    read: false,
                    means: false
                },
            }),
        }),
        {
          name: 'wordtoday-storage', // persist key
        }
      )
    )
  );