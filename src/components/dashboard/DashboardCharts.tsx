
import React from "react";
import { TimeRangeSlider } from "./charts/TimeRangeSlider";
import { MetricSelector } from "./charts/MetricSelector";
import { ChartContainer } from "./charts/ChartContainer";
import { ChartLayout } from "./charts/ChartLayout";
import { FinancialChart } from "./charts/FinancialChart";
import { HousingChart } from "./charts/HousingChart";
import { MiningChart } from "./charts/MiningChart";
import { AgricultureChart } from "./charts/AgricultureChart";
import { GreenHydrogenChart } from "./charts/GreenHydrogenChart";
import { useChartState } from "./charts/use-chart-state";
import { useChartData } from "./charts/use-chart-data";
import { InteractiveFeatures } from "./InteractiveFeatures";
import { Button } from "@/components/ui/button";
import { Plus, MessageCircle, SplitSquareVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Payload } from "recharts/types/component/DefaultLegendContent";
import {
  FINANCIAL_METRICS,
  HOUSING_METRICS,
  MINING_METRICS,
  AGRICULTURE_METRICS,
  GREEN_HYDROGEN_METRICS,
} from "./charts/chart-config";
import { Layout } from "./charts/types/chart-types";

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
  } = useChartData(timeRange);

  // Create a wrapper function to convert Payload to Metric for legend click handling
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

  // Convert selectedMetrics from Metric[] to string[] (just the keys)
  const selectedMetricKeys = selectedMetrics.map(metric => metric.key);

  // Create a wrapper for setLayout to match expected types
  const handleLayoutChange = (newLayout: string | string[]) => {
    if (typeof newLayout === 'string') {
      setLayout(newLayout as Layout);
    } else if (Array.isArray(newLayout) && newLayout.length > 0) {
      setLayout(newLayout[0] as Layout);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold">Interactive Analytics</h1>
            {simulationMode && (
              <Badge variant="secondary" className="ml-2">Simulation Mode</Badge>
            )}
          </div>
          <p className="text-muted-foreground mt-1">
            Compare models, run simulations, and collaborate with your team
          </p>
        </div>
        <div className="flex items-center gap-3">
          <TimeRangeSlider value={timeRange} onChange={setTimeRange} />
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            <span>Add Chart</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <SplitSquareVertical className="h-4 w-4" />
            <span>Layout</span>
          </Button>
        </div>
      </div>

      <InteractiveFeatures />

      <div className="flex flex-wrap gap-4 mb-6">
        {financialData && (
          <MetricSelector
            metrics={FINANCIAL_METRICS}
            selectedMetrics={selectedMetricKeys}
            onMetricToggle={handleMetricToggle}
          />
        )}
        {housingData && (
          <MetricSelector
            metrics={HOUSING_METRICS}
            selectedMetrics={selectedMetricKeys}
            onMetricToggle={handleMetricToggle}
          />
        )}
        {miningData && (
          <MetricSelector
            metrics={MINING_METRICS}
            selectedMetrics={selectedMetricKeys}
            onMetricToggle={handleMetricToggle}
          />
        )}
        {agricultureData && (
          <MetricSelector
            metrics={AGRICULTURE_METRICS}
            selectedMetrics={selectedMetricKeys}
            onMetricToggle={handleMetricToggle}
          />
        )}
        {hydrogenData && (
          <MetricSelector
            metrics={GREEN_HYDROGEN_METRICS}
            selectedMetrics={selectedMetricKeys}
            onMetricToggle={handleMetricToggle}
          />
        )}
      </div>

      <ChartLayout layout={layout} onLayoutChange={handleLayoutChange}>
        <ChartContainer
          id="financial"
          title="Cryptocurrency Trends"
          description="Price movements and predicted changes"
        >
          <FinancialChart
            data={financialData}
            isLoading={isLoadingFinancial}
            selectedMetrics={selectedMetricKeys}
            onLegendClick={handleLegendClickWrapper}
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
            onLegendClick={handleLegendClickWrapper}
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
            onLegendClick={handleLegendClickWrapper}
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
            onLegendClick={handleLegendClickWrapper}
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
            onLegendClick={handleLegendClickWrapper}
            enabledModels={models}
            simulationMode={simulationMode}
          />
        </ChartContainer>
      </ChartLayout>
    </div>
  );
};
