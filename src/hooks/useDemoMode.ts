
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DemoModeState {
  isDemoMode: boolean;
  toggleDemoMode: () => void;
  setDemoMode: (enabled: boolean) => void;
}

export const useDemoMode = create<DemoModeState>()(
  persist(
    (set) => ({
      isDemoMode: true, // Default to demo mode for visual demonstration
      toggleDemoMode: () => set((state) => ({ isDemoMode: !state.isDemoMode })),
      setDemoMode: (enabled: boolean) => set({ isDemoMode: enabled }),
    }),
    {
      name: 'predictive-pulse-demo-mode',
    }
  )
);
