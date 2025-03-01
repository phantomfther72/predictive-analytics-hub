
import { useFinancialMarketData } from "./useFinancialMarketData";
import { useHousingMarketData } from "./useHousingMarketData";
import { useMiningSectorData } from "./useMiningSectorData";
import { useAgricultureMarketData } from "./useAgricultureMarketData";
import { useGreenHydrogenData } from "./useGreenHydrogenData";

export const useMarketData = () => {
  const financialQuery = useFinancialMarketData();
  const housingQuery = useHousingMarketData();
  const miningQuery = useMiningSectorData();
  const agricultureQuery = useAgricultureMarketData();
  const hydrogenQuery = useGreenHydrogenData();

  return {
    financialData: financialQuery.data,
    housingData: housingQuery.data,
    miningData: miningQuery.data,
    agricultureData: agricultureQuery.data,
    hydrogenData: hydrogenQuery.data,
    isLoadingFinancial: financialQuery.isLoading,
    isLoadingHousing: housingQuery.isLoading,
    isLoadingMining: miningQuery.isLoading,
    isLoadingAgriculture: agricultureQuery.isLoading,
    isLoadingHydrogen: hydrogenQuery.isLoading,
  };
};
