import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware';

interface StrategyStore {
    showAnswer: boolean,
    isLoading: boolean,
    levelUpInfo: {
        level?: string;
        classification?: string;
        questionGroupType?: string;
        year?: string;
    },
    levelUpList: Array<any>,
    setStoreData: (code: string, value: any) => void,
    setLevelUpInfo: (levelUpInfo: any) => void,
    setLevelUpList: (levelUpList: any) => void,
    setLevelUpAnswer: (selectedData: any) => void,
    getLevelUpList: () => void,
    init: () => void,
}

export const useStrategyStore = create<StrategyStore>()(
    devtools(
        persist((set, get) => ({
            showAnswer: false,
            isLoading: false,
            levelUpInfo: {
                level: 'N1',
                classification: 'vocabulary',
                questionGroupType: 'A-1',
                year: 'random',
            },
            levelUpList: [],
            setStoreData: (code, value) => set((state) => ({ [code]: value })),
            setLevelUpInfo: (levelUpInfo) => set((state) => ({ levelUpInfo: levelUpInfo })),
            setLevelUpList: (levelUpList: Array<any>) => set((state) => ({ levelUpList: levelUpList })),
            setLevelUpAnswer: (selectedData: any) => set((state) => ({
                levelUpList: state.levelUpList.map((data: any) => {
                    if(data.questionNo === selectedData.questionNo) {
                        return {...data, selectedAnswer: selectedData.selectedAnswer}
                    } else {
                        return data
                    }
                })
            })),
            getLevelUpList: async () => {
                set({ isLoading: true });
                const response = await fetch('/api/strategy/list', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({params: get().levelUpInfo}),
                })
                const resData = await response.json();
                set({ levelUpList: resData, isLoading: false });
            },
            init: () => set({ 
                showAnswer: false,
                isLoading: false,
                levelUpInfo: {
                    level: 'N1',
                    classification: 'vocabulary',
                    questionGroupType: 'A-1',
                    year: 'random',
                },
                levelUpList: []
            }),
        }),
        {
          name: 'strategy-storage', // persist key
        }
      )
    )
  );