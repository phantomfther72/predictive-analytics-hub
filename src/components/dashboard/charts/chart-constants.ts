
export const CHART_COLORS = {
  primary: "#2563eb",
  secondary: "#16a34a",
  accent: "#0ea5e9",
  prediction: "#14b8a6",
  grid: "#e2e8f0",
  text: "#64748b",
} as const;

export const commonChartProps = {
  margin: { top: 10, right: 30, left: 0, bottom: 0 },
  className: "transition-all duration-300 ease-in-out",
};

export const commonAxisProps = {
  stroke: CHART_COLORS.text,
  fontSize: 12,
  fontFamily: "Inter, sans-serif",
  tickLine: false,
};
