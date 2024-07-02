import zustand from "zustand";

export const useNavbarType = zustand((set) => ({
  navbarType: "vertical",
  setNavbarType: (navbarType) => set({ navbarType }),
}));
