import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeStore {
  isDarkMode: boolean;
  toggle: () => void;
  setDarkMode: (isDark: boolean) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      isDarkMode: false,
      toggle: () => {
        set((state) => {
          const newMode = !state.isDarkMode;
          if (typeof document !== 'undefined') {
            if (newMode) {
              document.documentElement.classList.add('dark');
            } else {
              document.documentElement.classList.remove('dark');
            }
          }
          return { isDarkMode: newMode };
        });
      },
      setDarkMode: (isDark: boolean) => {
        set({ isDarkMode: isDark });
        if (typeof document !== 'undefined') {
          if (isDark) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
      },
    }),
    {
      name: 'theme-storage',
    }
  )
);