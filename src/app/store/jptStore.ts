import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware';

interface JptStore {
    showAnswer: boolean,
    showReadButton: boolean,
    showTransButton: boolean,
    isLoading: boolean,
    jptInfo: {
        level: string,
        classification: string,
    },
    jptList: Array<any>,
    setStoreData: (code: string, value: any) => void,
    setJptInfo: (jptInfo: any) => void,
    setJptList: (jptList: any) => void,
    setJptAnswer: (selectedData: any) => void,
    getJptList: () => void,
    init: () => void,
}

export const useJptStore = create<JptStore>()(
    devtools(
        persist((set, get) => ({
            showAnswer: false,
            showReadButton: true,
            showTransButton: false,
            isLoading: false,
            jptInfo: {
                level: 'N1',
                classification: '',
            },
            jptList: [],
            setStoreData: (code, value) => set((state:any) => ({ [code]: value })),
            setJptInfo: (jptInfo) => set((state:any) => ({ jptInfo: jptInfo })),
            setJptList: (jptList: Array<any>) => set((state:any) => ({ jptList: jptList })),
            setJptAnswer: (selectedData: any) => set((state:any) => ({
                jptList: state.jptList.map((data: any) => {
                    if(data.questionNo === selectedData.questionNo) {
                        return {...data, selectedAnswer: selectedData.selectedAnswer}
                    } else {
                        return data
                    }
                })
            })),
            getJptList: async () => {
                set({ isLoading: true });
                const response = await fetch('/api/jpt/list', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({params: get().jptInfo}),
                })
                const resData = await response.json();
                set({ jptList: resData, isLoading: false });
            },
            init: () => set({ 
                showAnswer: false,
                showReadButton: true,
                showTransButton: false,
                isLoading: false,
                jptInfo: {
                    level: 'N1',
                    classification: '',
                },
                jptList: []
            }),
        }),
        {
          name: 'levelup-storage', // persist key
        }
      )
    )
  );