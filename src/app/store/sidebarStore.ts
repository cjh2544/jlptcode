import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SidebarStore {
  collapsed: boolean;
  mobileOpen: boolean;
  setCollapsed: (collapsed: boolean) => void;
  toggleCollapsed: () => void;
  setMobileOpen: (mobileOpen: boolean) => void;
  toggleMobileOpen: () => void;
}

export const useSidebarStore = create<SidebarStore>()(
  persist(
    (set) => ({
      collapsed: false,
      mobileOpen: false,
      setCollapsed: (collapsed) => set({ collapsed }),
      toggleCollapsed: () => set((state) => ({ collapsed: !state.collapsed })),
      setMobileOpen: (mobileOpen) => set({ mobileOpen }),
      toggleMobileOpen: () =>
        set((state) => ({ mobileOpen: !state.mobileOpen })),
    }),
    {
      name: "sidebar-state",
      partialize: (state) => ({ collapsed: state.collapsed }),
    },
  ),
);
