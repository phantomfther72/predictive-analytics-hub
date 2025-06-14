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
import { FiltersBar } from "./charts/FiltersBar";

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

  // --- FILTER STATE ----
  const [region, setRegion] = React.useState("All");
  const [assetType, setAssetType] = React.useState("All");

  // Gather available region & assetType from all sector data
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

  const availableRegions = React.useMemo(
    () => [
      ...new Set([
        ...financialData.map(d => d.region || ""),
        ...housingData.map(d => d.region || ""),
        ...miningData.map(d => d.region || ""),
        ...agricultureData.map(d => d.region || ""),
        ...hydrogenData.map(d => d.region || ""),
      ].filter(Boolean)),
    ],
    [financialData, housingData, miningData, agricultureData, hydrogenData]
  );
  const availableAssetTypes = React.useMemo(
    () => [
      ...new Set([
        ...financialData.map(d => d.asset || ""),
        ...housingData.map(d => d.asset_type || d.asset || ""),
        ...miningData.map(d => d.commodity || ""),
        ...agricultureData.map(d => d.crop_type || ""),
        ...hydrogenData.map(d => d.asset_type || ""),
      ].filter(Boolean)),
    ],
    [financialData, housingData, miningData, agricultureData, hydrogenData]
  );

  // Universal filter function
  function filterByAll(d: any) {
    const regionMatch = region === "All" || (d.region && d.region === region);
    const assetMatch = assetType === "All" ||
      (d.asset_type && d.asset_type === assetType) ||
      (d.asset && d.asset === assetType) ||
      (d.commodity && d.commodity === assetType) ||
      (d.crop_type && d.crop_type === assetType);
    return regionMatch && assetMatch;
  }

  // Filtered datasets (pass into charts)
  const filteredFinancial = financialData.filter(filterByAll);
  const filteredHousing = housingData.filter(filterByAll);
  const filteredMining = miningData.filter(filterByAll);
  const filteredAgriculture = agricultureData.filter(filterByAll);
  const filteredHydrogen = hydrogenData.filter(filterByAll);

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
        onTimeRangeChange={setTimeRange}
      />
      <FiltersBar
        region={region}
        setRegion={setRegion}
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        assetType={assetType}
        setAssetType={setAssetType}
        availableRegions={availableRegions}
        availableAssetTypes={availableAssetTypes}
      />
      <InteractiveFeatures />
      <MetricSelectors 
        selectedMetricKeys={selectedMetricKeys}
        onMetricToggle={handleStringMetricToggle}
        financialData={filteredFinancial}
        housingData={filteredHousing}
        miningData={filteredMining}
        agricultureData={filteredAgriculture}
        hydrogenData={filteredHydrogen}
      />
      <ChartGrid 
        financialData={filteredFinancial}
        housingData={filteredHousing}
        miningData={filteredMining}
        agricultureData={filteredAgriculture}
        hydrogenData={filteredHydrogen}
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
