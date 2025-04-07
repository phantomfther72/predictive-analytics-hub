
/**
 * This file contains styling configurations for cryptocurrency charts
 * to maintain consistent styling across different chart types.
 */
import { CSSProperties } from "react";

export const chartColors = {
  primary: "#10B981", // green
  secondary: "#8B5CF6", // purple
  tertiary: "#0EA5E9", // blue
  negative: "#EF4444", // red
  background: "#1E293B", // slate-800
  backgroundLight: "#334155", // slate-700
  grid: "#2a3042",
  text: "#e2e8f0", // slate-200
};

export const chartGradients = {
  price: {
    id: "colorPrice",
    stopColor: chartColors.primary,
  },
  marketCap: {
    id: "colorMarketCap",
    stopColor: chartColors.secondary,
  },
  change: {
    id: "colorChange",
    stopColor: chartColors.tertiary,
  },
  volume: {
    id: "colorVolume",
    stopColor: chartColors.tertiary,
  },
};

export const chartStyles = {
  containerStyle: "bg-slate-900 rounded-lg p-4",
  
  // Axis styles
  axisTickStyle: { fill: chartColors.text },
  
  // Grid styles
  cartesianGridStyle: {
    stroke: chartColors.grid,
    strokeDasharray: "3 3",
    opacity: 0.2,
  },
  
  // Dot styles
  dotStyle: { r: 4 },
  activeDotStyle: { r: 6, fill: chartColors.primary, stroke: "#fff", strokeWidth: 2 },
  
  // Line styles
  primaryLineStyle: {
    stroke: chartColors.primary,
    strokeWidth: 2,
  },
  secondaryLineStyle: {
    stroke: chartColors.secondary,
    strokeWidth: 2,
  },
  tertiaryLineStyle: {
    stroke: chartColors.tertiary,
    strokeWidth: 2,
  },
  
  // Bar styles
  barRadius: [4, 4, 0, 0],
  
  // Model prediction line styles
  predictionLineStyle: {
    strokeWidth: 1.5,
    strokeDasharray: "5 5",
  },
};

// Price formatter for currency values
export const formatPrice = (value: number) => `$${value.toLocaleString()}`;

// Market cap formatter for large values
export const formatMarketCap = (value: number) => {
  if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
  return `$${value.toLocaleString()}`;
};
