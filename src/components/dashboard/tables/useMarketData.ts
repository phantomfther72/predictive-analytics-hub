
import { useFinancialMarketData } from "./useFinancialMarketData";
import { useHousingMarketData } from "./useHousingMarketData";
import { useMiningSectorData } from "./useMiningSectorData";
import { useAgricultureMarketData } from "./useAgricultureMarketData";
import { useGreenHydrogenData } from "./useGreenHydrogenData";
import { useCryptocurrencyData } from "./useCryptocurrencyData";
import { sampleMarketModelData } from "@/utils/sampleMarketModelData";

export const useMarketData = () => {
  const financialQuery = useFinancialMarketData();
  const housingQuery = useHousingMarketData();
  const miningQuery = useMiningSectorData();
  const agricultureQuery = useAgricultureMarketData();
  const hydrogenQuery = useGreenHydrogenData();
  const cryptoQuery = useCryptocurrencyData();

  return {
    financialData: financialQuery.data?.length ? financialQuery.data : sampleMarketModelData.financial,
    housingData: housingQuery.data?.length ? housingQuery.data : sampleMarketModelData.housing,
    miningData: miningQuery.data?.length ? miningQuery.data : sampleMarketModelData.mining,
    agricultureData: agricultureQuery.data?.length ? agricultureQuery.data : sampleMarketModelData.agriculture,
    hydrogenData: hydrogenQuery.data?.length ? hydrogenQuery.data : sampleMarketModelData.hydrogen,
    cryptoData: cryptoQuery.data || [],
    isLoadingFinancial: financialQuery.isLoading,
    isLoadingHousing: housingQuery.isLoading,
    isLoadingMining: miningQuery.isLoading,
    isLoadingAgriculture: agricultureQuery.isLoading,
    isLoadingHydrogen: hydrogenQuery.isLoading,
    isLoadingCrypto: cryptoQuery.isLoading,
  };
};
