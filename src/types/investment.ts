
import { MarketType } from "@/types/market";

export type InvestmentOpportunityAssetType = 
  'infrastructure' | 
  'fund' | 
  'project' | 
  'equity' | 
  'real_estate';

export type InvestmentOpportunityRiskLevel = 'low' | 'medium' | 'high';

export interface InvestmentOpportunity {
  id: string;
  title: string;
  description: string;
  asset_type: InvestmentOpportunityAssetType;
  industry_type: MarketType;
  region: string;
  current_value: number;
  predicted_change?: number;
  prediction_confidence?: number;
  risk_level: InvestmentOpportunityRiskLevel;
  minimum_investment: number;
  annual_return_percentage?: number;
  time_horizon: string;
  featured?: boolean;
  thumbnail_chart_data?: {
    data: number[];
    labels: string[];
  };
}
