
import React from "react";
import { useChartState } from "./charts/use-chart-state";
import { useChartData } from "./charts/use-chart-data";
import { InteractiveFeatures } from "./InteractiveFeatures";
import { Payload } from "recharts/types/component/DefaultLegendContent";
import {
  FINANCIAL_METRICS,
  HOUSING_METRICS,
  MINING_METRICS,
  AGRICULTURE_METRICS,
  GREEN_HYDROGEN_METRICS,
  Metric,
} from "./charts/chart-config";
import { TimeRange } from "./charts/types/chart-types";
import { ChartHeader } from "./charts/ChartHeader";
import { MetricSelectors } from "./charts/MetricSelectors";
import { ChartGrid } from "./charts/ChartGrid";

export const DashboardCharts = () => {
  const {
    timeRange,
    setTimeRange,
    selectedMetrics,
    layout,
    setLayout,
    handleLegendClick,
    handleMetricToggle,
    simulationMode,
    models,
  } = useChartState();

  const {
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
  } = useChartData(timeRange as TimeRange);

  const handleLegendClickWrapper = (data: Payload) => {
    if (data && typeof data.value === 'string') {
      const metricName = data.value;
      const allMetrics = [
        ...FINANCIAL_METRICS,
        ...HOUSING_METRICS,
        ...MINING_METRICS,
        ...AGRICULTURE_METRICS,
        ...GREEN_HYDROGEN_METRICS
      ];
      
      const metric = allMetrics.find(m => m.name === metricName);
      if (metric) {
        handleLegendClick(metric);
      }
    }
  };

  const selectedMetricKeys = selectedMetrics.map(metric => metric.key);

  const handleStringMetricToggle = (metricKey: string) => {
    const allMetrics = [
      ...FINANCIAL_METRICS,
      ...HOUSING_METRICS,
      ...MINING_METRICS,
      ...AGRICULTURE_METRICS,
      ...GREEN_HYDROGEN_METRICS
    ];
    
    const metric = allMetrics.find(m => m.key === metricKey);
    if (metric) {
      handleMetricToggle(metric);
    }
  };

  const handleLayoutChange = (newLayout: string[]) => {
    // Layout change implementation would go here
  };

  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value as TimeRange);
  };

  // Ensure we have some default metrics selected if none are selected
  React.useEffect(() => {
    if (selectedMetrics.length === 0 && FINANCIAL_METRICS.length > 0) {
      handleMetricToggle(FINANCIAL_METRICS[0]);
    }
  }, [selectedMetrics]);

  return (
    <div className="space-y-8">
      <ChartHeader 
        simulationMode={simulationMode}
        timeRange={timeRange}
        onTimeRangeChange={handleTimeRangeChange}
      />

      <InteractiveFeatures />

      <MetricSelectors 
        selectedMetricKeys={selectedMetricKeys}
        onMetricToggle={handleStringMetricToggle}
        financialData={financialData}
        housingData={housingData}
        miningData={miningData}
        agricultureData={agricultureData}
        hydrogenData={hydrogenData}
      />

      <ChartGrid 
        financialData={financialData}
        housingData={housingData}
        miningData={miningData}
        agricultureData={agricultureData}
        hydrogenData={hydrogenData}
        isLoadingFinancial={isLoadingFinancial}
        isLoadingHousing={isLoadingHousing}
        isLoadingMining={isLoadingMining}
        isLoadingAgriculture={isLoadingAgriculture}
        isLoadingHydrogen={isLoadingHydrogen}
        selectedMetricKeys={selectedMetricKeys}
        onLegendClick={handleLegendClickWrapper}
        models={models}
        simulationMode={simulationMode}
      />
    </div>
  );
};
