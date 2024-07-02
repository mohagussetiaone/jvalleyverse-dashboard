import zustand from "zustand";

export const useWidth = zustand((set) => ({
  width: 0,
  setWidth: (width) => set({ width }),
}));
