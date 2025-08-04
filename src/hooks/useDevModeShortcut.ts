import { useEffect } from 'react';
import { useDemoMode } from './useDemoMode';
import { toast } from 'sonner';

export const useDevModeShortcut = () => {
  const { activateDevMode, isDevMode } = useDemoMode();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl+Alt+D to activate dev mode
      if (event.ctrlKey && event.altKey && event.key === 'd') {
        event.preventDefault();
        if (!isDevMode) {
          activateDevMode();
          toast.success('Developer Mode Activated', {
            description: 'Full Terminal access granted for development',
          });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activateDevMode, isDevMode]);
};