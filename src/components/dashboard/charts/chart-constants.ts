
// Chart color constants
export const CHART_COLORS = {
  primary: "#0EA5E9",    // Ocean blue
  secondary: "#10B981",  // Teal
  accent: "#8B5CF6",     // Purple
  prediction: "#F59E0B", // Amber
  warning: "#EF4444",    // Red
  grid: "#334155",       // Slate
  text: "#94A3B8",       // Light slate
  background: "#1A1F2C"  // Dark background
};

// Common chart props
export const commonChartProps = {
  margin: { top: 20, right: 30, left: 10, bottom: 20 }
};

// Common axis props
export const commonAxisProps = {
  tick: { fill: CHART_COLORS.text },
  axisLine: { stroke: CHART_COLORS.text }
};
