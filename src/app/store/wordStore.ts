import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware';

const viewTypes = ["list", "slide"] as const;
type ViewType = typeof viewTypes[number];

type WordStore = {
    isLoading: boolean,
    viewType: ViewType,
    pageInfo?: Paginate,
    searchInfo: Word,
    wordList?: [Word],
    setViewType: (viewType: ViewType) => void,
    setPageInfo: (pageInfo: any) => void,
    setSearchInfo: (searchInfo: any) => void,
    setWordList: (wordList: any) => void,
    getPageInfo: () => void,
    getWordList: () => void,
    init: () => void,
}

const PAGE_PER_SIZE = 10

export const useWordStore = create<WordStore>() (
    devtools(
        persist((set, get) => ({
            isLoading: true,
            viewType: 'list',
            pageInfo: {
                total: 0, 
                totalPage: 1, 
                currentPage: 1, 
                startPage: 1, 
                pageSize: PAGE_PER_SIZE,
            },
            searchInfo: {
                type: 'jlpt',
                level: "1",
                parts: [],
            },
            wordList: [{}],
            setViewType: (viewType: ViewType) => set((state) => ({ viewType: viewType })),
            setPageInfo: (pageInfo: Paginate) => set((state) => ({ pageInfo: {...state.pageInfo, ...pageInfo} })),
            setSearchInfo: (searchInfo) => set((state) => {
                state.searchInfo = searchInfo
                return state
            }),
            setWordList: (wordList) => set((state) => ({ wordList: wordList })),
            getPageInfo: async () => {
                const response = await fetch('/api/word/page', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({searchInfo: get().searchInfo, pageInfo: get().pageInfo}),
                })

                const resData = await response.json();
                
                set({ 
                    pageInfo: resData,
                });
            },
            getWordList: async () => {
                const response = await fetch('/api/word/list', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({searchInfo: get().searchInfo, pageInfo: get().pageInfo}),
                })
                const resData = await response.json();
                set({ 
                    isLoading: false,
                    wordList: resData,
                });
            },
            init: () => set({ 
                pageInfo: {
                    total: 0, 
                    totalPage: 1, 
                    currentPage: 1, 
                    startPage: 1, 
                    pageSize: PAGE_PER_SIZE,
                },
                searchInfo: {
                    type: 'jlpt',
                    level: "1",
                    parts: [],
                },
                wordList: [{}]
            })
        }),
        {
          name: 'word-storage', // persist key
        }
    )
));