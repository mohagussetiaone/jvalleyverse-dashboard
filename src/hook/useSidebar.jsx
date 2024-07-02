import zustand from "zustand";

export const useSidebar = zustand((set) => ({
  isCollapsed: false,
  setMenuCollapsed: (val) => set({ isCollapsed: val }),
}));
