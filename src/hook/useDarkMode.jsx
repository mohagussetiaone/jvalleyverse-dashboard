import zustand from "zustand";

export const useDarkmode = zustand((set) => ({
  darkMode: false,
  setDarkMode: (darkMode) => set({ darkMode: darkMode }),
}));
