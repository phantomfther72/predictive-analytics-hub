
// Common styling for cryptocurrency charts
import { CategoricalChartProps } from "recharts";

// Chart Colors
export const chartColors = {
  primary: "#3B82F6", // blue-500
  secondary: "#10B981", // emerald-500
  tertiary: "#6366F1", // indigo-500
  accent: "#EC4899", // pink-500
  positive: "#22C55E", // green-500
  negative: "#EF4444", // red-500
  neutral: "#6B7280", // gray-500
  teal: "#14B8A6", // teal-500
  purple: "#8B5CF6", // violet-500
  amber: "#F59E0B", // amber-500
  dark: "#1E293B", // slate-800
  light: "#F8FAFC", // slate-50
};

// Bar Chart Margin
export const barChartMargins = {
  top: 20, 
  right: 30, 
  left: 20, 
  bottom: 5
};

// Line Chart Margin
export const lineChartMargins = {
  top: 20, 
  right: 30, 
  left: 20, 
  bottom: 5
};

// Area Chart Margin
export const areaChartMargins = {
  top: 20, 
  right: 30, 
  left: 0, 
  bottom: 0
};

// Composed Chart Margin
export const composedChartMargins = {
  top: 20, 
  right: 30, 
  left: 20, 
  bottom: 5
};

// Common Chart Props
export const commonChartProps: Partial<CategoricalChartProps> = {
  className: "w-full h-[300px] md:h-[400px]",
  margin: { top: 20, right: 30, left: 20, bottom: 5 }
};

// Chart Stroke Width
export const strokeWidth = 2;

// Chart Dot Size
export const dotSize = 5;

// Tooltip Cursor
export const tooltipCursor = { 
  stroke: chartColors.neutral, 
  strokeWidth: 1, 
  strokeDasharray: "5 5" 
};
