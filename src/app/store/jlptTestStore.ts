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
    jlptList: Array<any>,
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
            jlptList: [],
            setSearchInfo: (searchInfo) => set((state) => ({ searchInfo: searchInfo })),
            setShowAnswer: (showAnswer) => set((state) => ({ showAnswer: showAnswer })),
            setJlptList: (jlptList: Array<any>) => set((state) => ({ jlptList: jlptList })),
            setJlptAnswer: (selectedData: any) => set((state) => ({
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
                jlptList: []
            }),
        }),
        {
          name: 'jlpttest-storage', // persist key
        }
      )
    )
  );