import zustand from "zustand";

export const useContentWidth = zustand((set) => ({
  contentWidth: "",
  setContentWidth: (contentWidth) => set({ contentWidth: contentWidth }),
}));
