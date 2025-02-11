
import { PredictionFactors } from "@/types/market";

export const isPredictionFactors = (factors: any): factors is PredictionFactors => {
  return (
    factors &&
    typeof factors === 'object' &&
    typeof factors.market_trend === 'number' &&
    typeof factors.volatility === 'number' &&
    typeof factors.sentiment === 'number'
  );
};

export const parsePredictionFactors = (rawFactors: any): PredictionFactors | null => {
  if (!rawFactors) return null;
  
  try {
    const factors = typeof rawFactors === 'string' ? JSON.parse(rawFactors) : rawFactors;
    if (isPredictionFactors(factors)) {
      return factors;
    }
    return null;
  } catch {
    return null;
  }
};
