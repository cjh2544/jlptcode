import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware';

interface CommonCodeStore {
    codeList: Array<Code> | [],
    getCodeList: (codeList: Array<string>) => void,
    init: () => void,
}

export const useCommonCodeStore = create<CommonCodeStore>()(
    devtools(
        persist((set, get) => ({
            codeList: [],
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
            init: () => set({ 
                codeList: []
            }),
        }),
        {
          name: 'commoncode-storage', // persist key
        }
      )
    )
  );