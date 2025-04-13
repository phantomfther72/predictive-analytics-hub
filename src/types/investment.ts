
import { MarketType } from "@/types/market";
import { Json } from "@/integrations/supabase/types";

export type InvestmentOpportunityAssetType = 
  'infrastructure' | 
  'fund' | 
  'project' | 
  'equity' | 
  'real_estate' |
  'joint_venture' |
  'agricultural_project' |
  'venture_capital' |
  'business';

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
  } | Json;
  created_at?: string;
  updated_at?: string;
  contact_email?: string;
  contact_phone?: string;
  full_details?: Json;
}
