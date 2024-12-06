import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware';

const procTypes = ["create", "read", "update", "delete"] as const;
const messageTypes = ["info", "error", "warning"] as const;
type ProcType = typeof procTypes[number];
type MessageType = typeof messageTypes[number];

type BoardCommunityStore = {
    procType: ProcType,
    messageType: MessageType,
    isLoading: boolean,
    pageInfo?: Paginate,
    boardInfo: Board,
    boardList: [],
    errors: Array<any> | null,
    showConfirm: boolean,
    confirmMsg: string,
    success: boolean,
    setProcType: (procType: ProcType) => void,
    setBoardInfo: (boardInfo: Board) => void,
    setPageInfo: (pageInfo: any) => void,
    setLoading: (isLoading: boolean) => void, 
    setErrors: (errors: Array<any> | null) => void,
    setShowConfirm: (showConfirm: boolean) => void,
    setConfirmMsg: (confirmMsg: string) => void,
    setSuccess: (isSuccess: boolean) => void, 
    setMessageType: (messageType: MessageType) => void, 
    getPageInfo: () => void,
    getBoardInfo: (boardInfo: Board) => void,
    getBoardList: () => void,
    updateBoardInfo: (boardInfo: Board) => Object,
    deleteBoardInfo: (boardInfo: Board) => Object,
    init: () => void,
}

const PAGE_PER_SIZE = 1

export const useBoardCommunityStore = create<BoardCommunityStore>() (
    devtools(
        persist((set, get) => ({
            procType: 'create',
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
            setProcType: (procType: ProcType) => set((state) => ({ procType: procType })),
            setPageInfo: (pageInfo: Paginate) => set((state) => ({ pageInfo: {...state.pageInfo, ...pageInfo} })),
            setBoardInfo: (boardInfo) => set((state) => ({ boardInfo: {...state.boardInfo, ...boardInfo} })),
            setLoading: (isLoading) => set((state) => ({ isLoading: isLoading })),
            setErrors: (errors) => set((state) => ({ errors: errors })),
            setShowConfirm: (showConfirm) => set((state) => ({ showConfirm: showConfirm })),
            setConfirmMsg: (confirmMsg) => set((state) => ({ confirmMsg: confirmMsg })),
            setSuccess: (isSuccess) => set((state) => ({ success: isSuccess })),
            setMessageType: (messageType: MessageType) => set((state) => ({ messageType: messageType })),
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
            getBoardInfo: async (boardInfo) => {
                set({ 
                    boardInfo: {},
                });

                const response = await fetch('/api/board/community/view', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({boardInfo}),
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
            updateBoardInfo: async (boardInfo) => {
                const response = await fetch('/api/board/community', {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({...get().boardInfo, ...boardInfo}),
                })

                const resData = await response.json();

                return resData;
            },
            deleteBoardInfo: async (boardInfo) => {
                const response = await fetch('/api/board/community', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({...get().boardInfo, ...boardInfo}),
                })

                const resData = await response.json();

                return resData;
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