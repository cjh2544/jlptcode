import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware';

type BoardCommunityStore = {
    messageType: 'info' | 'error' | 'warning',
    isLoading: boolean,
    pageInfo?: Paginate,
    boardInfo: Board,
    boardList: [],
    errors: Array<any> | null,
    showConfirm: boolean,
    confirmMsg: string,
    success: boolean,
    setBoardInfo: (boardInfo: any) => void,
    setPageInfo: (pageInfo: any) => void,
    setLoading: (isLoading: boolean) => void, 
    setErrors: (errors: Array<any> | null) => void,
    setShowConfirm: (showConfirm: boolean) => void,
    setConfirmMsg: (confirmMsg: string) => void,
    setSuccess: (isSuccess: boolean) => void, 
    setMessageType: (messageType: 'info' | 'error' | 'warning') => void, 
    getPageInfo: () => void,
    getBoardInfo: () => void,
    getBoardList: () => void,
    init: () => void,
}

const PAGE_PER_SIZE = 1

export const useBoardCommunityStore = create<BoardCommunityStore>() (
    devtools(
        persist((set, get) => ({
            messageType: 'info',
            isLoading: true,
            pageInfo: {
                total: 0, 
                totalPage: 1, 
                currentPage: 1, 
                startPage: 1, 
                pageSize: PAGE_PER_SIZE,
            },
            boardInfo: {},
            boardList: [],
            errors: [],
            showConfirm: false,
            confirmMsg: '',
            success: false,
            setPageInfo: (pageInfo: Paginate) => set((state) => ({ pageInfo: {...state.pageInfo, ...pageInfo} })),
            setBoardInfo: (boardInfo) => set((state) => ({ boardInfo: {...state.boardInfo, ...boardInfo} })),
            setLoading: (isLoading) => set((state) => ({ isLoading: isLoading })),
            setErrors: (errors) => set((state) => ({ errors: errors })),
            setShowConfirm: (showConfirm) => set((state) => ({ showConfirm: showConfirm })),
            setConfirmMsg: (confirmMsg) => set((state) => ({ confirmMsg: confirmMsg })),
            setSuccess: (isSuccess) => set((state) => ({ success: isSuccess })),
            setMessageType: (messageType) => set((state) => ({ messageType: messageType })),
            getPageInfo: async () => {
                const response = await fetch('/api/board/community/page', {
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
            getBoardInfo: async () => {
                const response = await fetch('/api/board/community/view', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({boardInfo: get().boardInfo}),
                })

                const resData = await response.json();

                set({ 
                    boardInfo: resData,
                });
            },
            getBoardList: async () => {
                const response = await fetch('/api/board/community/list', {
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
                messageType: 'info',
                isLoading: true,
                pageInfo: {
                    total: 0, 
                    totalPage: 1, 
                    currentPage: 1, 
                    startPage: 1, 
                    pageSize: PAGE_PER_SIZE,
                },
                boardInfo: {},
                boardList: [],
                errors: [],
                showConfirm: false,
                confirmMsg: '',
                success: false,
            }),
        }),
        {
          name: 'board-community-storage', // persist key
        }
    )
));