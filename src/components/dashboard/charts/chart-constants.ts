
export const CHART_COLORS = {
  primary: "#2563eb",
  secondary: "#16a34a",
  accent: "#0ea5e9",
  prediction: "#14b8a6",
  grid: "#e2e8f0",
  text: "#64748b",
  axis: "#94a3b8",
  tertiary: "#8b5cf6",
  quaternary: "#ec4899"
};

export const commonChartProps = {
  margin: { top: 20, right: 30, left: 20, bottom: 20 },
  barSize: 20,
  barGap: 8,
};

export const commonAxisProps = {
  stroke: CHART_COLORS.grid,
  strokeDasharray: "3 3",
  tick: { fill: CHART_COLORS.text },
  fontSize: 12,
};
