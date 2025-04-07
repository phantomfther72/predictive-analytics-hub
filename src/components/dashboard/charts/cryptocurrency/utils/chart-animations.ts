
/**
 * This file contains animation configurations for cryptocurrency charts
 * to maintain consistent animations across different chart types.
 */

export interface AnimationConfig {
  isAnimationActive: boolean;
  animationDuration: number;
  animationEasing: 'ease-in-out' | 'ease' | 'ease-in' | 'ease-out' | 'linear';
  animationBegin?: number;
}

export const createBaseAnimationConfig = (
  isActive: boolean = true,
  duration: number = 900
): AnimationConfig => ({
  isAnimationActive: isActive,
  animationDuration: duration,
  animationEasing: 'ease-in-out',
});

export const getAnimationDelay = (index: number, baseDelay: number = 50): number => {
  return index * baseDelay;
};

export const createChartAnimationConfig = (isActive: boolean = true): {
  animationConfig: AnimationConfig;
  getAnimationDelay: (index: number) => number;
} => {
  return {
    animationConfig: createBaseAnimationConfig(isActive),
    getAnimationDelay: (index: number) => getAnimationDelay(index)
  };
};

// Specific chart entrance animations
export const entranceAnimations = {
  fadeIn: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.3 }
  },
  
  scale: {
    initial: { opacity: 0, scale: 0.98 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.98 },
    transition: { duration: 0.3 }
  }
};
