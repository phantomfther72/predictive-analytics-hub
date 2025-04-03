
import { FinancialMarketMetric } from "@/types/market";

export function generateMockFinancialData(): FinancialMarketMetric[] {
  const assets = ["BTC", "ETH", "NSX", "GOLD", "USD"];
  const baseTimestamp = new Date();
  const mockData: FinancialMarketMetric[] = [];
  
  for (let i = 0; i < 30; i++) {
    const timestamp = new Date(baseTimestamp);
    timestamp.setDate(baseTimestamp.getDate() - i);
    
    assets.forEach(asset => {
      const basePrice = asset === "BTC" ? 40000 : asset === "ETH" ? 2000 : asset === "NSX" ? 10000 : asset === "GOLD" ? 1800 : 1;
      
      mockData.push({
        id: `mock-finance-${asset}-${i}`,
        asset,
        current_price: basePrice + (Math.random() - 0.5) * basePrice * 0.2,
        change_percentage_24h: (Math.random() * 10) - 5,
        volume: Math.random() * 1000000000,
        timestamp: timestamp.toISOString(),
        predicted_change: (Math.random() * 8) - 4,
        prediction_timestamp: new Date(timestamp).toISOString(),
        prediction_confidence: 0.7 + Math.random() * 0.25,
        prediction_explanation: "Based on historical patterns and current market indicators",
        prediction_factors: {
          market_trend: Math.random() * 100,
          volatility: Math.random() * 100,
          sentiment: Math.random() * 100
        }
      });
    });
  }
  
  return mockData;
}
