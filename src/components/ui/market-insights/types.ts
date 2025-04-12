
import { MarketType } from "@/types/market";

export interface MarketInsight {
  id: string;
  title: string;
  description: string;
  industryType: MarketType;
  industryLabel: string;
  predictedChange?: number;
  timestamp?: string;
  metrics?: {
    name: string;
    value: string | number;
    change?: number;
  }[];
}
