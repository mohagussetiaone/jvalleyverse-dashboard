import zustand from "zustand";

export const useFooterType = zustand((set) => ({
  footerType: "static",
  setFooterType: (footerType) => set({ footerType: footerType }),
}));
