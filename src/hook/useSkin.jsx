import zustand from "zustand";

export const useSkin = zustand((set) => ({
  skin: "default",
  setSkin: (mod) => set({ skin: mod }),
}));
