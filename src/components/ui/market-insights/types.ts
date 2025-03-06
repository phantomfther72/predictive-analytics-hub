export interface MarketMetric {
  name: string;
  value: number;
  change: number;
  isPositive: boolean;
  unit?: string;
  label: string;  // Added required label property
}
