
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useQueryUtils } from "./useQueryUtils";
import { CryptocurrencyData } from "@/types/market";

export const useCryptocurrencyData = () => {
  const { handleError, processAlternativeModels, parsePredictionFactors } = useQueryUtils();

  return useQuery({
    queryKey: ["cryptocurrencyData"],
    queryFn: async () => {
      try {
        // Using financial_market_metrics table with a filter for cryptocurrency assets
        const { data, error } = await supabase
          .from("financial_market_metrics")
          .select("*")
          .eq("asset_type", "cryptocurrency");

        if (error) {
          handleError("Failed to fetch cryptocurrency data", error);
          return [];
        }

        if (!data || data.length === 0) {
          return [];
        }

        // Transform the financial market data to match the cryptocurrency data structure
        const cryptoData = data.map(item => ({
          id: item.id,
          symbol: (item.asset || "").split('-')[0] || item.asset, 
          name: getCryptoName(item.asset || ""),
          current_price_usd: item.current_price,
          market_cap_usd: item.volume * 2, // Simple approximation for the demo
          volume_24h_usd: item.volume,
          circulating_supply: Math.floor(Math.random() * 100000000) + 1000000, // Sample data
          total_supply: null,
          max_supply: null,
          price_change_percentage_24h: item.change_percentage_24h,
          price_change_percentage_7d: item.change_percentage_24h * 1.2, // Sample data
          price_change_percentage_30d: item.change_percentage_24h * 0.8, // Sample data
          all_time_high_usd: item.current_price * 1.5, // Sample data
          all_time_high_date: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
          timestamp: item.timestamp,
          predicted_change: item.predicted_change,
          prediction_timestamp: item.prediction_timestamp,
          prediction_confidence: item.prediction_confidence,
          prediction_explanation: item.prediction_explanation,
          prediction_factors: parsePredictionFactors(item.prediction_factors),
          alternative_model_predictions: processAlternativeModels(item, [
            { id: "momentum-based", multiplier: 1.2, confidenceModifier: 0.85 },
            { id: "sentiment-driven", multiplier: 0.8, confidenceModifier: 0.75 }
          ])
        }));

        return cryptoData as CryptocurrencyData[];
      } catch (error) {
        console.error("Error in cryptocurrency data fetch:", error);
        return [];
      }
    },
  });
};

// Helper function to get a crypto name from its symbol
const getCryptoName = (symbol: string): string => {
  const cryptoNames: Record<string, string> = {
    'BTC': 'Bitcoin',
    'ETH': 'Ethereum',
    'XRP': 'Ripple',
    'LTC': 'Litecoin',
    'ADA': 'Cardano',
    'DOT': 'Polkadot',
    'BNB': 'Binance Coin',
    'LINK': 'Chainlink',
    'XLM': 'Stellar',
    'DOGE': 'Dogecoin'
  };
  
  // Extract the first part if it's a pair format like BTC-USD
  const baseSymbol = symbol.split('-')[0] || symbol;
  
  return cryptoNames[baseSymbol] || baseSymbol;
};
