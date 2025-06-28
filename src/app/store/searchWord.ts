import { create } from 'zustand'
import { devtools } from 'zustand/middleware';

type SearchWordStore = {
    cart: number,
    add: (cnt:number) => void,
    remove: () => void,
    removeAll: () => void
}

export const useSearchWordStore = create(devtools<SearchWordStore>((set) => ({
    cart: 0,
    add: (cnt) => set((state:any) => ({ cart: state.cart + cnt })),
    remove: () => set((state:any) => ({ cart: state.cart - 1 })),
    removeAll: () => set({ cart: 0 }),
})));