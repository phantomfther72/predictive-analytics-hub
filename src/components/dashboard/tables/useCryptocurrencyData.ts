
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CryptocurrencyData } from "@/types/market";

export const useCryptocurrencyData = () => {
  return useQuery({
    queryKey: ["cryptocurrency-data"],
    queryFn: async (): Promise<CryptocurrencyData[]> => {
      // You could fetch from Supabase here if connected
      // For now we'll return mock data
      return mockCryptoData();
    },
  });
};

// Mock data function
const mockCryptoData = (): CryptocurrencyData[] => {
  // Fixed Crypto list
  const cryptos = [
    { symbol: "BTC", name: "Bitcoin" },
    { symbol: "ETH", name: "Ethereum" },
    { symbol: "SOL", name: "Solana" },
    { symbol: "BNB", name: "Binance Coin" },
    { symbol: "XRP", name: "Ripple" },
    { symbol: "ADA", name: "Cardano" },
    { symbol: "DOGE", name: "Dogecoin" },
    { symbol: "DOT", name: "Polkadot" },
    { symbol: "MATIC", name: "Polygon" },
    { symbol: "LTC", name: "Litecoin" },
  ];

  const timestamp = new Date().toISOString();
  
  return cryptos.map((crypto, index) => {
    const price = 10000 / (index + 1) + Math.random() * 1000;
    const marketCap = 100000000 / (index + 1) + Math.random() * 10000000;
    const volume = 5000000 / (index + 1) + Math.random() * 1000000;
    const priceChange = (Math.random() * 10) * (Math.random() > 0.5 ? 1 : -1);
    const predictedChange = (Math.random() * 15) * (Math.random() > 0.5 ? 1 : -1);
    
    return {
      id: `crypto-${index}`,
      symbol: crypto.symbol,
      name: crypto.name,
      current_price_usd: price,
      market_cap_usd: marketCap,
      volume_24h_usd: volume,
      circulating_supply: marketCap / price * 0.8,
      total_supply: marketCap / price,
      max_supply: marketCap / price * 1.2,
      price_change_percentage_24h: priceChange,
      price_change_percentage_7d: priceChange * 1.3,
      price_change_percentage_30d: priceChange * 1.7,
      all_time_high_usd: price * 1.5,
      all_time_high_date: new Date(Date.now() - Math.random() * 31536000000).toISOString(), // Random date in the last year
      timestamp: timestamp,
      predicted_change: predictedChange,
      prediction_timestamp: timestamp,
      prediction_confidence: 0.5 + Math.random() * 0.5,
      prediction_explanation: null,
      prediction_factors: {
        market_sentiment: Math.random() * 100,
        volatility: Math.random() * 100,
        sentiment: Math.random() * 100,
        market_trend: Math.random() * 100,
      },
    };
  });
};
