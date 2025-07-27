import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsStore {
  theme: 'light' | 'dark';
  autoPlay: boolean;
  soundEnabled: boolean;
  animationEnabled: boolean;
  
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  setAutoPlay: (enabled: boolean) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setAnimationEnabled: (enabled: boolean) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      theme: 'light',
      autoPlay: false,
      soundEnabled: true,
      animationEnabled: true,
      
      setTheme: (theme) => {
        set({ theme });
        document.documentElement.classList.toggle('dark', theme === 'dark');
      },
      
      toggleTheme: () => {
        const newTheme = get().theme === 'light' ? 'dark' : 'light';
        get().setTheme(newTheme);
      },
      
      setAutoPlay: (autoPlay) => set({ autoPlay }),
      setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
      setAnimationEnabled: (animationEnabled) => set({ animationEnabled }),
    }),
    {
      name: 'settings-store',
      onRehydrateStorage: () => (state) => {
        if (state) {
          document.documentElement.classList.toggle('dark', state.theme === 'dark');
        }
      },
    }
  )
);
