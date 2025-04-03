
import { FinancialMarketMetric } from "@/types/market";

/**
 * Generates realistic mock financial market data for testing and development
 * @param days Number of days of historical data to generate
 * @returns Array of FinancialMarketMetric objects
 */
export function generateMockFinancialData(days = 30): FinancialMarketMetric[] {
  const assets = [
    { symbol: "BTC", basePrice: 42000, volatility: 0.05, trend: 0.001 },
    { symbol: "ETH", basePrice: 2200, volatility: 0.06, trend: 0.0015 }, 
    { symbol: "NSX", basePrice: 10000, volatility: 0.02, trend: -0.0005 },
    { symbol: "GOLD", basePrice: 1830, volatility: 0.01, trend: 0.0002 },
    { symbol: "USD", basePrice: 1, volatility: 0.002, trend: 0 }
  ];
  
  const baseTimestamp = new Date();
  const mockData: FinancialMarketMetric[] = [];
  
  // Generate price movement with realistic patterns
  for (let i = 0; i < days; i++) {
    const timestamp = new Date(baseTimestamp);
    timestamp.setDate(baseTimestamp.getDate() - (days - i - 1));
    
    assets.forEach(asset => {
      // Generate a price that follows a trend plus random walk
      let previousPrice = asset.basePrice;
      
      // Find the previous price for this asset if it exists
      const previousDataPoint = mockData.find(
        d => d.asset === asset.symbol && 
        new Date(d.timestamp).getDate() === timestamp.getDate() - 1
      );
      
      if (previousDataPoint) {
        previousPrice = previousDataPoint.current_price;
      }
      
      // Calculate new price with trend and volatility
      const randomFactor = Math.random() * 2 - 1; // Between -1 and 1
      const trendFactor = asset.trend * previousPrice;
      const volatilityFactor = asset.volatility * previousPrice * randomFactor;
      const newPrice = previousPrice + trendFactor + volatilityFactor;
      
      // Calculate 24h change
      const changePercentage = ((newPrice - previousPrice) / previousPrice) * 100;
      
      // Generate proportional trading volume
      const baseVolume = newPrice * 10000; // Higher priced assets have higher nominal volume
      const volumeVariation = (Math.random() * 0.5 + 0.75); // 75%-125% of base volume
      const volume = baseVolume * volumeVariation * (1 + Math.abs(changePercentage) / 10); // Higher volatility, higher volume

      // Generate predicted change - slightly more optimistic than actual trends
      const marketSentiment = Math.random() > 0.7 ? -1 : 1; // 70% chance of positive sentiment
      const predictedChange = changePercentage * 1.2 * marketSentiment;
      
      // Prediction confidence is higher for less volatile assets
      const predictionConfidence = Math.max(0.5, Math.min(0.95, 1 - asset.volatility * 10));

      mockData.push({
        id: `mock-finance-${asset.symbol}-${i}`,
        asset: asset.symbol,
        current_price: newPrice,
        change_percentage_24h: changePercentage,
        volume: volume,
        timestamp: timestamp.toISOString(),
        predicted_change: predictedChange,
        prediction_timestamp: new Date(timestamp.getTime() + 24*60*60*1000).toISOString(),
        prediction_confidence: predictionConfidence,
        prediction_explanation: generatePredictionExplanation(asset.symbol, predictedChange),
        prediction_factors: {
          market_trend: Math.random() * 60 + 20,
          volatility: Math.random() * 50 + 10,
          sentiment: Math.random() * 70 + 15
        }
      });
    });
  }
  
  return mockData;
}

/**
 * Generates a realistic prediction explanation based on the asset and predicted change
 */
function generatePredictionExplanation(asset: string, predictedChange: number): string {
  const direction = predictedChange >= 0 ? "upward" : "downward";
  
  const explanations = [
    `Analysis of historical patterns and current market indicators suggest a ${direction} trend for ${asset}.`,
    `${asset} is expected to move ${direction} based on technical analysis and market sentiment.`,
    `Market momentum and trading patterns indicate ${direction} pressure on ${asset}.`,
    `${direction.charAt(0).toUpperCase() + direction.slice(1)} trajectory for ${asset} predicted based on volume analysis and price action.`,
    `Economic indicators and market fundamentals suggest ${direction} movement for ${asset}.`
  ];
  
  return explanations[Math.floor(Math.random() * explanations.length)];
}
