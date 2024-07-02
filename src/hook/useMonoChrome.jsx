import zustand from "zustand";

export const useMonoChrome = zustand((set) => ({
  isMonochrome: false,
  setMonoChrome: (val) => set({ isMonochrome: val }),
}));
