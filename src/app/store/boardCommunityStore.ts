import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware';

type BoardCommunityStore = {
    isLoading: boolean,
    pageInfo?: Paginate,
    boardInfo: {
        id?: string,
        title?: string,
        contents?: string,
    },
    boardList: [],
    setBoardInfo: (boardInfo: any) => void,
    setPageInfo: (pageInfo: any) => void,
    getPageInfo: () => void,
    getBoardList: () => void,
    init: () => void,
}

const PAGE_PER_SIZE = 1

export const useBoardCommunityStore = create<BoardCommunityStore>() (
    devtools(
        persist((set, get) => ({
            isLoading: true,
            pageInfo: {
                total: 0, 
                totalPage: 1, 
                currentPage: 1, 
                startPage: 1, 
                pageSize: PAGE_PER_SIZE,
            },
            boardInfo: {
                id: '',
                title: '',
                contents: ''
            },
            boardList: [],
            setPageInfo: (pageInfo: Paginate) => set((state) => ({ pageInfo: pageInfo })),
            setBoardInfo: (boardInfo) => set((state) => ({ boardInfo: boardInfo })),
            getPageInfo: async () => {
                const response = await fetch('/api/boardCommunity/page', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({boardInfo: get().boardInfo, pageInfo: get().pageInfo}),
                })

                const resData = await response.json();

                set({ 
                    pageInfo: resData,
                });
            },
            getBoardList: async () => {
                const response = await fetch('/api/boardCommunity/list', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({boardInfo: get().boardInfo, pageInfo: get().pageInfo}),
                })
                const resData = await response.json();
                set({ 
                    isLoading: false,
                    boardList: resData,
                });
            },
            init: () => set({
                isLoading: true,
                pageInfo: {
                    total: 0, 
                    totalPage: 1, 
                    currentPage: 1, 
                    startPage: 1, 
                    pageSize: PAGE_PER_SIZE,
                },
                boardInfo: {},
                boardList: []
            }),
        }),
        {
          name: 'board-community-storage', // persist key
        }
    )
));