import zustand from "zustand";

export const useRtl = zustand((set) => ({
  isRtl: false,
  handleRtl: (val) => set({ isRtl: val }),
}));
