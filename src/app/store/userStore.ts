import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware';

const procTypes = ["create", "read", "update", "delete"] as const;
const messageTypes = ["info", "error", "warning"] as const;
type ProcType = typeof procTypes[number];
type MessageType = typeof messageTypes[number];

const PAGE_PER_SIZE = 10

type UserStore = {
    procType: ProcType,
    messageType: MessageType,
    isLoading: boolean,
    pageInfo?: Paginate,
    searchInfo?: any,
    userInfo: User,
    userList: [],
    errors: Array<any> | null,
    showConfirm: boolean,
    confirmMsg: string,
    success: boolean,
    setProcType: (procType: ProcType) => void,
    setUserInfo: (userInfo: User) => void,
    setPageInfo: (pageInfo: any) => void,
    setSearchInfo: (searchInfo: any) => void,
    setLoading: (isLoading: boolean) => void, 
    setErrors: (errors: Array<any> | null) => void,
    setShowConfirm: (showConfirm: boolean) => void,
    setConfirmMsg: (confirmMsg: string) => void,
    setSuccess: (isSuccess: boolean) => void, 
    setMessageType: (messageType: MessageType) => void, 
    getPageInfo: () => void,
    getUserInfo: (userInfo: User) => void,
    getUserList: () => void,
    updateUserInfo: (userInfo: User) => Object,
    deleteUserInfo: (userInfo: User) => Object,
    init: () => void,
}

export const useUserStore = create<UserStore>() (
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
            searchInfo: {},
            userInfo: {},
            userList: [],
            errors: [],
            showConfirm: false,
            confirmMsg: '',
            success: false,
            setProcType: (procType: ProcType) => set((state) => ({ procType: procType })),
            setPageInfo: (pageInfo: Paginate) => set((state) => ({ pageInfo: {...state.pageInfo, ...pageInfo} })),
            setUserInfo: (userInfo) => set((state) => ({ userInfo: {...state.userInfo, ...userInfo} })),
            setSearchInfo: (searchInfo) => set((state) => ({ searchInfo: searchInfo })),
            setLoading: (isLoading) => set((state) => ({ isLoading: isLoading })),
            setErrors: (errors) => set((state) => ({ errors: errors })),
            setShowConfirm: (showConfirm) => set((state) => ({ showConfirm: showConfirm })),
            setConfirmMsg: (confirmMsg) => set((state) => ({ confirmMsg: confirmMsg })),
            setSuccess: (isSuccess) => set((state) => ({ success: isSuccess })),
            setMessageType: (messageType: MessageType) => set((state) => ({ messageType: messageType })),
            getPageInfo: async () => {
                const response = await fetch('/api/user/page', {
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
            getUserInfo: async (userInfo) => {
                set({ 
                    userInfo: {},
                });

                const response = await fetch('/api/user/view', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({userInfo}),
                })

                const resUserInfo = await response.json();

                set({ 
                    userInfo: resUserInfo,
                });
            },
            getUserList: async () => {
                const response = await fetch('/api/user/list', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({searchInfo: get().searchInfo, pageInfo: get().pageInfo}),
                })
                const resData = await response.json();
                set({ 
                    isLoading: false,
                    userList: resData,
                });
            },
            updateUserInfo: async (userInfo) => {
                const response = await fetch('/api/user', {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({...get().userInfo, ...userInfo}),
                })

                const resData = await response.json();

                return resData;
            },
            deleteUserInfo: async (userInfo) => {
                const response = await fetch('/api/user', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({...get().userInfo, ...userInfo}),
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
                searchInfo: {},
                userInfo: {},
                userList: [],
                errors: [],
                showConfirm: false,
                confirmMsg: '',
                success: false,
            }),
        }),
        {
          name: 'user-storage', // persist key
        }
    )
));