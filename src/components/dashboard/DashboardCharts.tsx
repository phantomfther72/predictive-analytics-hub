
import React, { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Payload } from "recharts/types/component/DefaultLegendContent";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { parsePredictionFactors } from "./tables/PredictionFactorsUtils";
import { TimeRangeSlider } from "./charts/TimeRangeSlider";
import { MetricSelector, type Metric } from "./charts/MetricSelector";
import { ChartContainer } from "./charts/ChartContainer";
import { ChartLayout } from "./charts/ChartLayout";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { CHART_COLORS } from "./charts/chart-constants";
import { FinancialChart } from "./charts/FinancialChart";
import { HousingChart } from "./charts/HousingChart";
import { MiningChart } from "./charts/MiningChart";

const FINANCIAL_METRICS: Metric[] = [
  { key: "current_price", name: "Price", color: CHART_COLORS.primary },
  { key: "volume", name: "Volume", color: CHART_COLORS.secondary },
  { key: "predicted_change", name: "Prediction", color: CHART_COLORS.prediction },
];

const HOUSING_METRICS: Metric[] = [
  { key: "avg_price_usd", name: "Average Price", color: CHART_COLORS.primary },
  { key: "listings_active", name: "Active Listings", color: CHART_COLORS.secondary },
];

const MINING_METRICS: Metric[] = [
  { key: "market_value_usd", name: "Market Value", color: CHART_COLORS.primary },
  { key: "production_mt", name: "Production (MT)", color: CHART_COLORS.secondary },
];

export const DashboardCharts = () => {
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState(1);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([
    "current_price",
    "volume",
    "avg_price_usd",
    "listings_active",
    "market_value_usd",
    "production_mt"
  ]);
  const [layout, setLayout] = useLocalStorage<string[]>("chart-layout", [
    "financial",
    "housing",
    "mining"
  ]);

  const handleMetricToggle = useCallback((metric: string) => {
    setSelectedMetrics(prev => 
      prev.includes(metric) 
        ? prev.filter(m => m !== metric)
        : [...prev, metric]
    );
  }, []);

  const handleLegendClick = (data: Payload) => {
    if (data.dataKey) {
      handleMetricToggle(data.dataKey.toString());
    }
  };

  const { data: financialData, isLoading: isLoadingFinancial } = useQuery({
    queryKey: ["financialMetrics", timeRange],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("financial_market_metrics")
        .select("*")
        .order("timestamp", { ascending: true });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch financial data",
          variant: "destructive",
        });
        throw error;
      }

      return data.map(item => ({
        ...item,
        prediction_factors: parsePredictionFactors(item.prediction_factors)
      }));
    },
    refetchInterval: 60000,
  });

  const { data: housingData, isLoading: isLoadingHousing } = useQuery({
    queryKey: ["housingMetrics", timeRange],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("housing_market_data")
        .select("*")
        .order("timestamp", { ascending: true });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch housing data",
          variant: "destructive",
        });
        throw error;
      }

      return data.map(item => ({
        ...item,
        prediction_factors: parsePredictionFactors(item.prediction_factors)
      }));
    },
  });

  const { data: miningData, isLoading: isLoadingMining } = useQuery({
    queryKey: ["miningMetrics", timeRange],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("mining_sector_insights")
        .select("*")
        .order("timestamp", { ascending: true });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch mining data",
          variant: "destructive",
        });
        throw error;
      }

      return data.map(item => ({
        ...item,
        prediction_factors: parsePredictionFactors(item.prediction_factors)
      }));
    },
  });

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
