
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

  return cryptos.map((crypto, index) => ({
    id: `crypto-${index}`,
    name: crypto.name,
    symbol: crypto.symbol,
    current_price: 10000 / (index + 1) + Math.random() * 1000,
    market_cap: 100000000 / (index + 1) + Math.random() * 10000000,
    total_volume: 5000000 / (index + 1) + Math.random() * 1000000,
    price_change_percentage_24h: (Math.random() * 10) * (Math.random() > 0.5 ? 1 : -1),
    sparkline_data: Array(24).fill(0).map(() => 100 + Math.random() * 50),
    predicted_change: (Math.random() * 15) * (Math.random() > 0.5 ? 1 : -1),
    prediction_confidence: 0.5 + Math.random() * 0.5,
    prediction_factors: {
      market_sentiment: Math.random() * 100,
      technical_indicators: Math.random() * 100,
      social_volume: Math.random() * 100,
    },
  }));
};
