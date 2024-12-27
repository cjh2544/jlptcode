import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware';

interface CommonCodeStore {
    codeList: Array<Code> | [],
    yearCodeList: Array<any> | [],
    getCodeList: (codeList: Array<string>) => void,
    getYearCodeList: (wordTypeList: Array<string>) => void,
    init: () => void,
}

export const useCommonCodeStore = create<CommonCodeStore>()(
    devtools(
        persist((set, get) => ({
            codeList: [],
            yearCodeList: [],
            getCodeList: async (codeList: Array<string>) => {
                const response = await fetch('/api/commonCode/list', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({codeList}),
                })
                const resData = await response.json();
                set({ codeList: resData });
            },
            getYearCodeList: async (codeList: Array<string>) => {
                const response = await fetch('/api/commonCode/year/list', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({codeList}),
                })
                const resData = await response.json();
                set({ yearCodeList: resData });
            },
            init: () => set({ 
                codeList: [],
                yearCodeList: []
            }),
        }),
        {
          name: 'commoncode-storage', // persist key
        }
      )
    )
  );