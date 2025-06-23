
export type MarketRegion = 'developed' | 'emerging' | 'frontier';
export type AssetClass = 'equity' | 'commodity' | 'real_estate' | 'fixed_income' | 'crypto';
export type CommodityType = 'gold' | 'copper' | 'lithium' | 'oil' | 'gas' | 'agricultural';

export interface GlobalEquityData {
  id: string;
  symbol: string;
  name: string;
  exchange: string;
  region: MarketRegion;
  asset_class: AssetClass;
  commodity_type?: CommodityType;
  current_price: number;
  currency: string;
  market_cap?: number;
  volume_24h: number;
  change_24h: number;
  change_percentage_24h: number;
  high_52w?: number;
  low_52w?: number;
  pe_ratio?: number;
  dividend_yield?: number;
  beta?: number;
  timestamp: string;
  created_at?: string;
  updated_at?: string;
  // AI-generated predictions
  predicted_change?: number;
  prediction_confidence?: number;
  prediction_explanation?: string;
  prediction_factors?: {
    technical_score: number;
    fundamental_score: number;
    sentiment_score: number;
    macro_score: number;
  };
}

export interface FundStrategy {
  id: string;
  name: string;
  type: 'momentum' | 'mean_reversion' | 'esg' | 'value' | 'growth' | 'hybrid';
  description: string;
  risk_level: 'low' | 'medium' | 'high';
  expected_return: number;
  max_drawdown: number;
  rebalance_frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  asset_allocation: {
    asset_class: AssetClass;
    target_percentage: number;
    min_percentage: number;
    max_percentage: number;
  }[];
  constraints?: {
    max_single_position: number;
    max_sector_exposure: number;
    min_diversification_score: number;
  };
}

export interface UserFund {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  strategy_id: string;
  initial_capital: number;
  current_value: number;
  total_return: number;
  total_return_percentage: number;
  sharpe_ratio?: number;
  max_drawdown_realized?: number;
  positions: FundPosition[];
  performance_history: PerformancePoint[];
  status: 'active' | 'paused' | 'closed';
  auto_rebalance: boolean;
  created_at: string;
  updated_at: string;
}

export interface FundPosition {
  symbol: string;
  quantity: number;
  average_cost: number;
  current_price: number;
  market_value: number;
  unrealized_pnl: number;
  unrealized_pnl_percentage: number;
  weight_percentage: number;
}

export interface PerformancePoint {
  timestamp: string;
  value: number;
  daily_return: number;
  cumulative_return: number;
}
