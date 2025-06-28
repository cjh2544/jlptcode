import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware';

interface LevelUpStore {
    showAnswer: boolean,
    showReadButton: boolean,
    showTransButton: boolean,
    isLoading: boolean,
    levelUpInfo: {
        level: string,
        classification: string,
    },
    levelUpList: Array<any>,
    setStoreData: (code: string, value: any) => void,
    setLevelUpInfo: (levelUpInfo: any) => void,
    setLevelUpList: (levelUpList: any) => void,
    setLevelUpAnswer: (selectedData: any) => void,
    getLevelUpList: () => void,
    init: () => void,
}

export const useLevelUpStore = create<LevelUpStore>()(
    devtools(
        persist((set, get) => ({
            showAnswer: false,
            showReadButton: true,
            showTransButton: false,
            isLoading: false,
            levelUpInfo: {
                level: 'N1',
                classification: '',
            },
            levelUpList: [],
            setStoreData: (code, value) => set((state:any) => ({ [code]: value })),
            setLevelUpInfo: (levelUpInfo) => set((state:any) => ({ levelUpInfo: levelUpInfo })),
            setLevelUpList: (levelUpList: Array<any>) => set((state:any) => ({ levelUpList: levelUpList })),
            setLevelUpAnswer: (selectedData: any) => set((state:any) => ({
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
                const response = await fetch('/api/levelUp/list', {
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
                showReadButton: true,
                showTransButton: false,
                isLoading: false,
                levelUpInfo: {
                    level: 'N1',
                    classification: '',
                },
                levelUpList: []
            }),
        }),
        {
          name: 'levelup-storage', // persist key
        }
      )
    )
  );