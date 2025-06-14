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

// Helper functions to collect availableRegion and availableAssetTypes per sector
function getFinancialAvailableRegions(financialData: any[]) {
  // financial_market_metrics: asset, no region in schema!
  return [];
}
function getFinancialAvailableAssets(financialData: any[]) {
  // financial_market_metrics: asset column
  return [
    ...new Set(financialData.map(d => d.asset).filter(Boolean)),
  ];
}

function getHousingAvailableRegions(housingData: any[]) {
  // housing_market_data: region
  return [
    ...new Set(housingData.map(d => d.region).filter(Boolean)),
  ];
}
function getHousingAvailableAssets(housingData: any[]) {
  // housing_market_data: no asset/asset_type, but can use region as pseudo-asset
  return [];
}

function getMiningAvailableRegions(miningData: any[]) {
  // mining_sector_insights: no region in schema
  return [];
}
function getMiningAvailableAssets(miningData: any[]) {
  // mining_sector_insights: commodity
  return [
    ...new Set(miningData.map(d => d.commodity).filter(Boolean)),
  ];
}

function getAgricultureAvailableRegions(agricultureData: any[]) {
  // agriculture_market_data: region
  return [
    ...new Set(agricultureData.map(d => d.region).filter(Boolean)),
  ];
}
function getAgricultureAvailableAssets(agricultureData: any[]) {
  // agriculture_market_data: crop_type
  return [
    ...new Set(agricultureData.map(d => d.crop_type).filter(Boolean)),
  ];
}

function getHydrogenAvailableRegions(hydrogenData: any[]) {
  // green_hydrogen_metrics: no region in schema
  return [];
}
function getHydrogenAvailableAssets(hydrogenData: any[]) {
  // green_hydrogen_metrics: asset_type (optional)
  return [
    ...new Set(hydrogenData.map(d => d.asset_type).filter(Boolean)),
  ];
}

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
  // Use the broadest possible keys for compatibility; fallback to "All"
  const [region, setRegion] = React.useState("All");
  const [assetType, setAssetType] = React.useState("All");

  // Gather available regions & assets by concatenating sector-specific lists
  const {
    financialData = [],
    housingData = [],
    miningData = [],
    agricultureData = [],
    hydrogenData = [],
    isLoadingFinancial,
    isLoadingHousing,
    isLoadingMining,
    isLoadingAgriculture,
    isLoadingHydrogen,
  } = useChartData(timeRange as TimeRange);

  // Compose available regions and asset types across all datasets
  const availableRegions = React.useMemo(() => {
    return [
      ...new Set([
        ...getHousingAvailableRegions(housingData),
        ...getAgricultureAvailableRegions(agricultureData)
      ].filter(Boolean))
    ];
  }, [housingData, agricultureData]);
  const availableAssetTypes = React.useMemo(() => {
    return [
      ...getFinancialAvailableAssets(financialData),
      ...getMiningAvailableAssets(miningData),
      ...getAgricultureAvailableAssets(agricultureData),
      ...getHydrogenAvailableAssets(hydrogenData)
    ].filter(Boolean);
  }, [financialData, miningData, agricultureData, hydrogenData]);

  // Universal filter function — only filter where the key exists on a datum
  function filterByAll(d: any) {
    // region-handling
    let regionMatch = true;
    if (region !== "All") {
      if ("region" in d) {
        regionMatch = d.region === region;
      } else {
        // no region property — don't filter out
        regionMatch = true;
      }
    }
    // asset-handling (try all keys relevant)
    let assetMatch = true;
    if (assetType !== "All") {
      if ("asset" in d && d.asset === assetType) {
        assetMatch = true;
      } else if ("asset_type" in d && d.asset_type === assetType) {
        assetMatch = true;
      } else if ("commodity" in d && d.commodity === assetType) {
        assetMatch = true;
      } else if ("crop_type" in d && d.crop_type === assetType) {
        assetMatch = true;
      } else {
        assetMatch = false;
      }
    }
    return regionMatch && assetMatch;
  }

  // Filtered datasets
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
    // ... keep layout change logic the same (if any)
  };

  // Accepts only a TimeRange as value
  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value as TimeRange);
  };

  // Ensure at least one metric is always selected
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
      <FiltersBar
        region={region}
        setRegion={setRegion}
        timeRange={timeRange}
        setTimeRange={handleTimeRangeChange}
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
