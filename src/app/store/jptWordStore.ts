import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware';

const viewTypes = ["list", "slide"] as const;
type ViewType = typeof viewTypes[number];
// 단어 유형
const wordTypes = ["word", "todayWord", "todaySentence", "todayGrammar"] as const;
type WordType = typeof wordTypes[number];
// 단어보여주기 속도
const speedTypes = [4000, 3000, 2000] as const;
type SpeedType = typeof speedTypes[number];

type JptWordInfoType = {
    type?: string;
    level?: string;
    word?: string;
    read?: string;
    means?: string;
    hideWord?: boolean,
    hideRead?: boolean,
    hideMeans?: boolean,
}

type HeaderVisibleType = {
    [index: string]: boolean;
    word: boolean;
    read: boolean;
    means: boolean;
}

type JptWordStore = {
    speed: SpeedType,
    autoSlide: boolean,
    showDelay: number,
    hideAll: HeaderVisibleType,
    isLoading: boolean,
    viewType: ViewType,
    pageInfo?: Paginate,
    searchInfo: JptWordInfoType,
    wordList: Array<JptWordInfoType>,
    setStoreData: (code:any, value:any) => void,
    setViewType: (viewType: ViewType) => void,
    setPageInfo: (pageInfo: any) => void,
    setSearchInfo: (searchInfo: any) => void,
    setWordList: (wordList: any) => void,
    getPageInfo: () => void,
    getWordList: () => void,
    setHideAllInfo: (headerVisibleInfo: HeaderVisibleType) => void,
    init: () => void,
}

const PAGE_PER_SIZE = 10

export const useJptWordStore = create<JptWordStore>() (
    devtools(
        persist((set, get) => ({
            speed: speedTypes[0],
            autoSlide: true,
            showDelay: 3000,
            hideAll: {
                word: false,
                read: false,
                means: false
            },
            isLoading: true,
            viewType: 'list',
            wordType: 'word',
            pageInfo: {
                total: 0, 
                totalPage: 1, 
                currentPage: 1, 
                startPage: 1, 
                pageSize: PAGE_PER_SIZE,
            },
            searchInfo: {
                type: 'jpt',
                level: "고득점(900)",
            },
            wordList: [],
            setStoreData: ({key, value}) => set((state:any) => ({
                [key]: value
            })),
            setViewType: (viewType: ViewType) => set((state:any) => ({ viewType: viewType })),
            setPageInfo: (pageInfo: Paginate) => set((state:any) => ({ pageInfo: {...state.pageInfo, ...pageInfo} })),
            setSearchInfo: (searchInfo) => set((state:any) => ({searchInfo: searchInfo})),
            setWordList: (wordList) => set((state:any) => ({ wordList: wordList })),
            getPageInfo: async () => {
                const response = await fetch('/api/jptWord/page', {
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
                const response = await fetch('/api/jptWord/list', {
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
            setHideAllInfo: (headerVisibleInfo: HeaderVisibleType) => set((state:any) => ({
                hideAll: headerVisibleInfo,
                wordList: state.wordList.map((data: JptWordInfoType) => {
                    data.hideWord = headerVisibleInfo.word;
                    data.hideRead = headerVisibleInfo.read;
                    data.hideMeans = headerVisibleInfo.means;
                    
                    return data;
                })
            })),
            init: () => set({ 
                speed: speedTypes[0],
                autoSlide: true,
                showDelay: 3000,
                pageInfo: {
                    total: 0, 
                    totalPage: 1, 
                    currentPage: 1, 
                    startPage: 1, 
                    pageSize: PAGE_PER_SIZE,
                },
                searchInfo: {
                    type: 'jpt',
                    level: "고득점(900)",
                },
                wordList: [],
                hideAll: {
                    word: false,
                    read: false,
                    means: false
                },
            })
        }),
        {
          name: 'word-storage-jpt', // persist key
        }
    )
));