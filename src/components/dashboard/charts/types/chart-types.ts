
export type Dataset = "financial" | "housing" | "mining" | "agriculture" | "green_hydrogen";
export type Layout = "line" | "bar" | "scatter";
export type TimeRange = "1D" | "7D" | "1W" | "1M" | "3M" | "6M" | "1Y" | "ALL";
export type ChartData = Record<string, any>;

export interface ChartAnnotation {
  id: string;
  x: number;
  y: number;
  text: string;
  author: string;
}
