import { cloneDeep } from 'lodash';
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware';

type GrammarTodayInfoType = {
    level: string;
    year: string;
    sortNo: string;
    sentence: string; 
    sentence_read: string;
    sentence_translate: string;
    question: any;
    showQuestion: boolean;
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

interface GrammarTodayStore {
    grammarTodayInfo: {
        level: string,
        study: string,
    },
    hideAll: HeaderVisibleType,
    grammarTodayList: Array<GrammarTodayInfoType>,
    setGrammarTodayInfo: (grammarTodayInfo: any, isSearch?: boolean) => void,
    setGrammarTodayList: (grammarTodayList: any) => void,
    setGrammarTodayAnswer: (selectedData: any) => void,
    getGrammarTodayList: () => void,
    getGrammarTodayAllList: () => void,
    setHideAllInfo: (headerVisibleInfo: HeaderVisibleType) => void,
    init: () => void,
}

export const useGrammarTodayStore = create<GrammarTodayStore>()(
    devtools(
        persist((set, get) => ({
            grammarTodayInfo: {
                level: '',
                study: '',
            },
            hideAll: {
                sentence: false,
                sentence_read: false,
                sentence_translate: false
            },
            grammarTodayList: [],
            // setGrammarTodayInfo: (grammarTodayInfo, isSearch = true) => set((state:any) => {
            //     state.grammarTodayInfo = grammarTodayInfo;
            //     isSearch && state.getGrammarTodayList();
            //     return state;
            // }),
            setGrammarTodayInfo: (grammarTodayInfo, isSearch = true) => {
                set(() => ({
                    grammarTodayInfo: { ...grammarTodayInfo },
                }));

                if (isSearch) get().getGrammarTodayList();
            },
            setGrammarTodayList: (grammarTodayList: Array<any>) => set((state:any) => ({ grammarTodayList: grammarTodayList })),
            setGrammarTodayAnswer: (selectedData: any) => set((state:any) => {
                state.grammarTodayList = state.grammarTodayList.map((data: any) => {
                    if(data.questionNo === selectedData.questionNo) {
                        return {...data, selectedAnswer: selectedData.selectedAnswer}
                    } else {
                        return data
                    }
                });
                return state;
            }),
            getGrammarTodayList: async () => {
                const response = await fetch('/api/grammarToday/list', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({params: get().grammarTodayInfo}),
                })
                const resData = await response.json();
                set({ 
                    grammarTodayList: resData, 
                    hideAll: {
                        sentence: false,
                        sentence_read: false,
                        sentence_translate: false
                    }
                });
            },
            getGrammarTodayAllList: async () => {
                const response = await fetch('/api/grammarToday/listAll', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({params: get().grammarTodayInfo}),
                })
                const resData = await response.json();
                set({ 
                    grammarTodayList: resData, 
                    hideAll: {
                        sentence: false,
                        sentence_read: false,
                        sentence_translate: false
                    }
                });
            },
            setHideAllInfo: (headerVisibleInfo: HeaderVisibleType) => set((state:any) => ({
                hideAll: headerVisibleInfo,
                grammarTodayList: state.grammarTodayList.map((data: any) => {
                    data.hideSentence = headerVisibleInfo.sentence;
                    data.hideSentenceRead = headerVisibleInfo.sentence_read;
                    data.hideSentenceTranslate = headerVisibleInfo.sentence_translate;
                    
                    return data;
                })
            })),
            init: () => set({ 
                grammarTodayInfo: {
                    level: '',
                    study: '',
                },
                grammarTodayList: [],
                hideAll: {
                    sentence: false,
                    sentence_read: false,
                    sentence_translate: false
                },
            }),
        }),
        {
          name: 'grammartoday-storage', // persist key
        }
      )
    )
  );