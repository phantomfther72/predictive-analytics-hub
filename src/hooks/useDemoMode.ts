
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DemoModeState {
  isDemoMode: boolean;
  isDevMode: boolean;
  toggleDemoMode: () => void;
  setDemoMode: (enabled: boolean) => void;
  toggleDevMode: () => void;
  setDevMode: (enabled: boolean) => void;
  activateDevMode: () => void;
}

export const useDemoMode = create<DemoModeState>()(
  persist(
    (set) => ({
      isDemoMode: true, // Default to demo mode for visual demonstration
      isDevMode: false, // Dev mode for bypassing role gates
      toggleDemoMode: () => set((state) => ({ isDemoMode: !state.isDemoMode })),
      setDemoMode: (enabled: boolean) => set({ isDemoMode: enabled }),
      toggleDevMode: () => set((state) => ({ isDevMode: !state.isDevMode })),
      setDevMode: (enabled: boolean) => set({ isDevMode: enabled }),
      activateDevMode: () => set({ isDevMode: true }),
    }),
    {
      name: 'predictive-pulse-demo-mode',
    }
  )
);
