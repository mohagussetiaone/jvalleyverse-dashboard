import zustand from "zustand";

export const useMobileMenu = zustand((set) => ({
  mobileMenu: false,
  openMobileMenu: () => set({ mobileMenu: true }),
  closeMobileMenu: () => set({ mobileMenu: false }),
}));
