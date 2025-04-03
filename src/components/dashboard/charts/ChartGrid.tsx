
import React from "react";
import { ChartContainer } from "./ChartContainer";
import { FinancialChart } from "./FinancialChart";
import { HousingChart } from "./HousingChart";
import { MiningChart } from "./MiningChart";
import { AgricultureChart } from "./AgricultureChart";
import { GreenHydrogenChart } from "./GreenHydrogenChart";
import { Payload } from "recharts/types/component/DefaultLegendContent";
import { ModelSettings } from "./use-chart-state";

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
        <FinancialChart
          data={financialData}
          isLoading={isLoadingFinancial}
          selectedMetrics={selectedMetricKeys}
          onLegendClick={onLegendClick}
          enabledModels={models}
          simulationMode={simulationMode}
        />
      </ChartContainer>

      <ChartContainer
        id="housing"
        title="Housing Market Overview"
        description="Regional price trends and listings"
      >
        <HousingChart
          data={housingData}
          isLoading={isLoadingHousing}
          selectedMetrics={selectedMetricKeys}
          onLegendClick={onLegendClick}
          enabledModels={models}
          simulationMode={simulationMode}
        />
      </ChartContainer>

      <ChartContainer
        id="mining"
        title="Mining Sector Performance"
        description="Production and market value trends"
      >
        <MiningChart
          data={miningData}
          isLoading={isLoadingMining}
          selectedMetrics={selectedMetricKeys}
          onLegendClick={onLegendClick}
          enabledModels={models}
          simulationMode={simulationMode}
        />
      </ChartContainer>

      <ChartContainer
        id="agriculture"
        title="Agriculture Market Insights"
        description="Crop yields, prices, and environmental factors"
      >
        <AgricultureChart
          data={agricultureData}
          isLoading={isLoadingAgriculture}
          selectedMetrics={selectedMetricKeys}
          onLegendClick={onLegendClick}
          enabledModels={models}
          simulationMode={simulationMode}
        />
      </ChartContainer>

      <ChartContainer
        id="green-hydrogen"
        title="Green Hydrogen Metrics"
        description="Production capacity and market dynamics"
      >
        <GreenHydrogenChart
          data={hydrogenData}
          isLoading={isLoadingHydrogen}
          selectedMetrics={selectedMetricKeys}
          onLegendClick={onLegendClick}
          enabledModels={models}
          simulationMode={simulationMode}
        />
      </ChartContainer>
    </div>
  );
};
