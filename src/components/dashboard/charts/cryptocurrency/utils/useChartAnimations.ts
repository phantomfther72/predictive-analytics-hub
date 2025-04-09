
import { useState, useEffect } from 'react';
import { createBaseAnimationConfig, getAnimationDelay } from './chart-animations';

export const useChartAnimations = () => {
  const [isAnimationActive, setIsAnimationActive] = useState(true);
  
  useEffect(() => {
    // Disable animations after first render for better performance
    const timer = setTimeout(() => {
      setIsAnimationActive(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const animations = {
    isActive: isAnimationActive,
    duration: 900,
    easing: 'ease-in-out' as const,
    delay: 50
  };
  
  return { animations };
};
