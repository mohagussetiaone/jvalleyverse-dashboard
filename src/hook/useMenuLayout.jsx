import zustand from "zustand";

export const useMenuLayout = zustand((set) => ({
  menuLayout: "vertical",
  setMenuLayout: (menuLayout) => set({ menuLayout }),
}));
