import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware';

interface JlptTestStore {
    isLoading: boolean,
    searchInfo: {
        level: string,
        classification: string,
        test: string,
    },
    showAnswer: boolean,
    showReadButton: boolean,
    showTransButton: boolean,
    jlptList: Array<any>,
    setStoreData: (code: string, value: any) => void,
    setSearchInfo: (searchInfo: any) => void,
    setShowAnswer: (showAnswer: boolean) => void,
    setJlptList: (jlptList: any) => void,
    setJlptAnswer: (selectedData: any) => void,
    getJlptList: () => void,
    init: () => void,
}

export const useJlptTestStore = create<JlptTestStore>()(
    devtools(
        persist((set, get) => ({
            isLoading: false,
            searchInfo: {
                level: '',
                classification: '',
                test: '',
            },
            showAnswer: false,
            showReadButton: true,
            showTransButton: true,
            jlptList: [],
            setStoreData: (code, value) => set((state:any) => ({ [code]: value })),
            setSearchInfo: (searchInfo) => set((state:any) => ({ searchInfo: searchInfo })),
            setShowAnswer: (showAnswer) => set((state:any) => ({ showAnswer: showAnswer })),
            setJlptList: (jlptList: Array<any>) => set((state:any) => ({ jlptList: jlptList })),
            setJlptAnswer: (selectedData: any) => set((state:any) => ({
                jlptList: state.jlptList.map((data: any) => {
                    if(data.questionNo === selectedData.questionNo) {
                        return {...data, selectedAnswer: selectedData.selectedAnswer}
                    } else {
                        return data
                    }
                })
            })),
            getJlptList: async () => {
                set({ isLoading: true });
                const response = await fetch('/api/jlptTest/list', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({params: get().searchInfo}),
                })
                const resData = await response.json();
                set({ jlptList: resData, isLoading: false });
            },
            init: () => set({ 
                isLoading: false,
                searchInfo: {
                    level: '',
                    classification: '',
                    test: '',
                },
                showAnswer: false,
                showReadButton: true,
                showTransButton: true,
                jlptList: []
            }),
        }),
        {
          name: 'jlpttest-storage', // persist key
        }
      )
    )
  );