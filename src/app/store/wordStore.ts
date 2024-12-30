import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware';
import WordList from '../wordToday/components/wordList';

const viewTypes = ["list", "slide"] as const;
type ViewType = typeof viewTypes[number];
const wordTypes = ["word", "todayWord", "todaySentence", "todayGrammar"] as const;
type WordType = typeof wordTypes[number];

type WordInfoType = {
    type?: string;
    level?: string;
    word?: string;
    read?: string;
    means?: string;
    parts?: Array<string>;
    wordType: string;
    hideWord?: boolean,
    hideRead?: boolean,
    hideMeans?: boolean,
    wordShowType?: string,
}

type HeaderVisibleType = {
    [index: string]: boolean;
    word: boolean;
    read: boolean;
    means: boolean;
}

type WordStore = {
    showDelay: number,
    hideAll: HeaderVisibleType,
    isLoading: boolean,
    viewType: ViewType,
    pageInfo?: Paginate,
    searchInfo: WordInfoType,
    wordList: Array<WordInfoType>,
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

export const useWordStore = create<WordStore>() (
    devtools(
        persist((set, get) => ({
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
                type: 'jlpt',
                level: "1",
                wordType: '1',
                parts: [],
                wordShowType: '1',
            },
            wordList: [],
            setStoreData: ({key, value}) => set((state) => ({
                [key]: value
            })),
            setViewType: (viewType: ViewType) => set((state) => ({ viewType: viewType })),
            setPageInfo: (pageInfo: Paginate) => set((state) => ({ pageInfo: {...state.pageInfo, ...pageInfo} })),
            setSearchInfo: (searchInfo) => set((state) => ({searchInfo: searchInfo})),
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
            setHideAllInfo: (headerVisibleInfo: HeaderVisibleType) => set((state) => ({
                hideAll: headerVisibleInfo,
                wordList: state.wordList.map((data: WordInfoType) => {
                    data.hideWord = headerVisibleInfo.word;
                    data.hideRead = headerVisibleInfo.read;
                    data.hideMeans = headerVisibleInfo.means;
                    
                    return data;
                })
            })),
            init: () => set({ 
                showDelay: 3000,
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
                    wordType: '1',
                    parts: [],
                    wordShowType: '1'
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
          name: 'word-storage', // persist key
        }
    )
));