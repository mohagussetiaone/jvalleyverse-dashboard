import { create } from "zustand";

const useDarkMode = create((set) => ({
  darkMode: false,
  toggleDarkMode: () =>
    set((state) => {
      const isDarkMode = !state.darkMode;
      if (isDarkMode) {
        document.body.classList.add("dark");
      } else {
        document.body.classList.remove("dark");
      }
      return { darkMode: isDarkMode };
    }),
}));

export default useDarkMode;
