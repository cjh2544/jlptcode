import { create } from "zustand";
import { devtools } from "zustand/middleware";

const PAGE_PER_SIZE = 10;

type AdminDataStore = {
  table: string;
  isLoading: boolean;
  pageInfo: Paginate;
  searchInfo: Record<string, string | undefined>;
  rows: Array<Record<string, unknown>>;
  setTable: (table: string) => void;
  setLoading: (isLoading: boolean) => void;
  setPageInfo: (pageInfo: Partial<Paginate>) => void;
  setSearchInfo: (searchInfo: Record<string, string | undefined>) => void;
  getPageInfo: () => Promise<void>;
  getList: () => Promise<void>;
  init: (table: string) => Promise<void>;
};

export const useAdminDataStore = create<AdminDataStore>()(
  devtools((set, get) => ({
    table: "",
    isLoading: false,
    pageInfo: {
      total: 0,
      totalPage: 1,
      currentPage: 1,
      startPage: 1,
      pageSize: PAGE_PER_SIZE,
    },
    searchInfo: {},
    rows: [],
    setTable: (table) => set({ table }),
    setLoading: (isLoading) => set({ isLoading }),
    setPageInfo: (pageInfo) =>
      set((state) => ({ pageInfo: { ...state.pageInfo, ...pageInfo } })),
    setSearchInfo: (searchInfo) => set({ searchInfo }),
    getPageInfo: async () => {
      const { table, searchInfo, pageInfo } = get();
      const response = await fetch(`/api/admin/data/${table}/page`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ searchInfo, pageInfo }),
      });
      const resData = await response.json();
      set({ pageInfo: { ...pageInfo, ...resData } });
    },
    getList: async () => {
      const { table, searchInfo, pageInfo } = get();
      const response = await fetch(`/api/admin/data/${table}/list`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ searchInfo, pageInfo }),
      });
      const resData = await response.json();
      set({ rows: resData });
    },
    init: async (table) => {
      set({
        table,
        searchInfo: {},
        pageInfo: {
          total: 0,
          totalPage: 1,
          currentPage: 1,
          startPage: 1,
          pageSize: PAGE_PER_SIZE,
        },
        rows: [],
      });
      set({ isLoading: true });
      await get().getPageInfo();
      await get().getList();
      set({ isLoading: false });
    },
  })),
);
