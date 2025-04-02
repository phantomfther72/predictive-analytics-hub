
export type Dataset = "financial" | "housing" | "mining" | "agriculture" | "green_hydrogen";
export type Layout = "line" | "bar" | "scatter";
export type TimeRange = "1D" | "7D" | "1W" | "1M" | "3M" | "6M" | "1Y" | "ALL";
export type ChartData = Record<string, any>;

export interface GridLayout {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  static?: boolean;
}

export interface ChartAnnotation {
  id: string;
  chartId: string;
  x: number;
  y: number;
  text: string;
  content: string;
  author: string;
  timestamp: Date;
  replies: Array<{
    id: string;
    author: string;
    content: string;
    timestamp: Date;
  }>;
}
