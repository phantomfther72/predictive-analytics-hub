import React from "react";
import { ChartContainer } from "./ChartContainer";
import { FinancialChart } from "./FinancialChart";
import { HousingChart } from "./HousingChart";
import { MiningChart } from "./MiningChart";
import { AgricultureChart } from "./AgricultureChart";
import { GreenHydrogenChart } from "./GreenHydrogenChart";
import { Payload } from "recharts/types/component/DefaultLegendContent";
import { ModelSettings } from "./use-chart-state";
import { ChartFallback } from "./ChartFallback";

interface ChartGridProps {
  financialData: any[] | undefined;
  housingData: any[] | undefined;
  miningData: any[] | undefined;
  agricultureData: any[] | undefined;
  hydrogenData: any[] | undefined;
  isLoadingFinancial: boolean;
  isLoadingHousing: boolean;
  isLoadingMining: boolean;
  isLoadingAgriculture: boolean;
  isLoadingHydrogen: boolean;
  selectedMetricKeys: string[];
  onLegendClick: (data: Payload) => void;
  models: ModelSettings[];
  simulationMode: boolean;
}

export const ChartGrid: React.FC<ChartGridProps> = ({
  financialData,
  housingData,
  miningData,
  agricultureData,
  hydrogenData,
  isLoadingFinancial,
  isLoadingHousing,
  isLoadingMining,
  isLoadingAgriculture,
  isLoadingHydrogen,
  selectedMetricKeys,
  onLegendClick,
  models,
  simulationMode
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <ChartContainer
        id="financial"
        title="Cryptocurrency Trends"
        description="Price movements and predicted changes"
      >
        {isLoadingFinancial && <ChartFallback title="Loading Financial Data..." message="Fetching Namibian crypto & market metrics." />}
        {!isLoadingFinancial && financialData?.length === 0 && <ChartFallback title="No Data" message="Namibian financial market metrics unavailable." />}
        {!isLoadingFinancial && financialData?.length > 0 && (
          <FinancialChart
            data={financialData}
            isLoading={isLoadingFinancial}
            selectedMetrics={selectedMetricKeys}
            onLegendClick={onLegendClick}
            enabledModels={models}
            simulationMode={simulationMode}
          />
        )}
      </ChartContainer>

      <ChartContainer
        id="housing"
        title="Housing Market Overview"
        description="Regional price trends and listings"
      >
        {isLoadingHousing && <ChartFallback title="Loading Housing Data..." message="Fetching Namibian housing metrics." />}
        {!isLoadingHousing && housingData?.length === 0 && <ChartFallback title="No Data" message="Namibian housing data unavailable." />}
        {!isLoadingHousing && housingData?.length > 0 && (
          <HousingChart
            data={housingData}
            isLoading={isLoadingHousing}
            selectedMetrics={selectedMetricKeys}
            onLegendClick={onLegendClick}
            enabledModels={models}
            simulationMode={simulationMode}
          />
        )}
      </ChartContainer>

      <ChartContainer
        id="mining"
        title="Mining Sector Performance"
        description="Production and market value trends"
      >
        {isLoadingMining && <ChartFallback title="Loading Mining Data..." message="Fetching Namibian mining sector metrics." />}
        {!isLoadingMining && miningData?.length === 0 && <ChartFallback title="No Data" message="Mining sector analysis unavailable." />}
        {!isLoadingMining && miningData?.length > 0 && (
          <MiningChart
            data={miningData}
            isLoading={isLoadingMining}
            selectedMetrics={selectedMetricKeys}
            onLegendClick={onLegendClick}
            enabledModels={models}
            simulationMode={simulationMode}
          />
        )}
      </ChartContainer>

      <ChartContainer
        id="agriculture"
        title="Agriculture Market Insights"
        description="Crop yields, prices, and environmental factors"
      >
        {isLoadingAgriculture && <ChartFallback title="Loading Agriculture Data..." message="Fetching Namibian agriculture metrics." />}
        {!isLoadingAgriculture && agricultureData?.length === 0 && <ChartFallback title="No Data" message="Namibian agri-data unavailable." />}
        {!isLoadingAgriculture && agricultureData?.length > 0 && (
          <AgricultureChart
            data={agricultureData}
            isLoading={isLoadingAgriculture}
            selectedMetrics={selectedMetricKeys}
            onLegendClick={onLegendClick}
            enabledModels={models}
            simulationMode={simulationMode}
          />
        )}
      </ChartContainer>

      <ChartContainer
        id="green-hydrogen"
        title="Green Hydrogen Metrics"
        description="Production capacity and market dynamics"
      >
        {isLoadingHydrogen && <ChartFallback title="Loading Green Hydrogen Data..." message="Fetching hydrogen industry data." />}
        {!isLoadingHydrogen && hydrogenData?.length === 0 && <ChartFallback title="No Data" message="Green hydrogen data unavailable." />}
        {!isLoadingHydrogen && hydrogenData?.length > 0 && (
          <GreenHydrogenChart
            data={hydrogenData}
            isLoading={isLoadingHydrogen}
            selectedMetrics={selectedMetricKeys}
            onLegendClick={onLegendClick}
            enabledModels={models}
            simulationMode={simulationMode}
          />
        )}
      </ChartContainer>
    </div>
  );
};
