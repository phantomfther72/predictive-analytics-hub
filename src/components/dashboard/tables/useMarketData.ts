
import { useFinancialMarketData } from "./useFinancialMarketData";
import { useHousingMarketData } from "./useHousingMarketData";
import { useMiningSectorData } from "./useMiningSectorData";
import { useAgricultureMarketData } from "./useAgricultureMarketData";
import { useGreenHydrogenData } from "./useGreenHydrogenData";
import { useCryptocurrencyData } from "./useCryptocurrencyData";

export const useMarketData = () => {
  const financialQuery = useFinancialMarketData();
  const housingQuery = useHousingMarketData();
  const miningQuery = useMiningSectorData();
  const agricultureQuery = useAgricultureMarketData();
  const hydrogenQuery = useGreenHydrogenData();
  const cryptoQuery = useCryptocurrencyData();

  return {
    financialData: financialQuery.data,
    housingData: housingQuery.data,
    miningData: miningQuery.data,
    agricultureData: agricultureQuery.data,
    hydrogenData: hydrogenQuery.data,
    cryptoData: cryptoQuery.data,
    isLoadingFinancial: financialQuery.isLoading,
    isLoadingHousing: housingQuery.isLoading,
    isLoadingMining: miningQuery.isLoading,
    isLoadingAgriculture: agricultureQuery.isLoading,
    isLoadingHydrogen: hydrogenQuery.isLoading,
    isLoadingCrypto: cryptoQuery.isLoading,
  };
};
