import zustand from "zustand";

export const useSemiDark = zustand((set) => ({
  isSemiDark: false,
  setSemiDark: (val) => set({ isSemiDark: val }),
}));
