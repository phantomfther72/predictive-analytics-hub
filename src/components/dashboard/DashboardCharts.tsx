
import React from "react";
import { TimeRangeSlider } from "./charts/TimeRangeSlider";
import { MetricSelector } from "./charts/MetricSelector";
import { ChartContainer } from "./charts/ChartContainer";
import { ChartLayout } from "./charts/ChartLayout";
import { FinancialChart } from "./charts/FinancialChart";
import { HousingChart } from "./charts/HousingChart";
import { MiningChart } from "./charts/MiningChart";
import { useChartState } from "./charts/use-chart-state";
import { useChartData } from "./charts/use-chart-data";
import { FINANCIAL_METRICS, HOUSING_METRICS, MINING_METRICS } from "./charts/chart-config";

export const DashboardCharts = () => {
  const {
    timeRange,
    setTimeRange,
    selectedMetrics,
    layout,
    setLayout,
    handleLegendClick,
    handleMetricToggle,
  } = useChartState();

  const {
    financialData,
    housingData,
    miningData,
    isLoadingFinancial,
    isLoadingHousing,
    isLoadingMining,
  } = useChartData(timeRange);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold">Interactive Charts</h1>
        <div className="flex flex-col md:flex-row gap-6">
          <TimeRangeSlider value={timeRange} onChange={setTimeRange} />
          <div className="flex flex-col gap-4">
            {financialData && (
              <MetricSelector
                metrics={FINANCIAL_METRICS}
                selectedMetrics={selectedMetrics}
                onMetricToggle={handleMetricToggle}
              />
            )}
            {housingData && (
              <MetricSelector
                metrics={HOUSING_METRICS}
                selectedMetrics={selectedMetrics}
                onMetricToggle={handleMetricToggle}
              />
            )}
            {miningData && (
              <MetricSelector
                metrics={MINING_METRICS}
                selectedMetrics={selectedMetrics}
                onMetricToggle={handleMetricToggle}
              />
            )}
          </div>
        </div>
      </div>

      <ChartLayout onLayoutChange={setLayout}>
        <ChartContainer
          id="financial"
          title="Cryptocurrency Trends"
          description="Price movements and predicted changes"
        >
          <FinancialChart
            data={financialData}
            isLoading={isLoadingFinancial}
            selectedMetrics={selectedMetrics}
            onLegendClick={handleLegendClick}
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
            selectedMetrics={selectedMetrics}
            onLegendClick={handleLegendClick}
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
            selectedMetrics={selectedMetrics}
            onLegendClick={handleLegendClick}
          />
        </ChartContainer>
      </ChartLayout>
    </div>
  );
};
