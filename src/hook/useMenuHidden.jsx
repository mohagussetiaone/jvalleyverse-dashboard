import zustand from "zustand";

export const useMenuHidden = zustand((set) => ({
  menuHidden: false,
  setMenuHidden: (menuHidden) => set({ menuHidden: menuHidden }),
}));
