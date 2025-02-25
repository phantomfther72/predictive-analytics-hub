import React, { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceArea,
} from "recharts";
import type { Payload } from "recharts/types/component/DefaultLegendContent";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { parsePredictionFactors } from "./tables/PredictionFactorsUtils";
import { TimeRangeSlider } from "./charts/TimeRangeSlider";
import { MetricSelector, type Metric } from "./charts/MetricSelector";
import { ChartTooltip } from "./charts/ChartTooltip";
import type { FinancialMarketMetric, HousingMarketData, MiningSectorInsight } from "@/types/market";

const CHART_COLORS = {
  primary: "#2563eb",
  secondary: "#16a34a",
  accent: "#0ea5e9",
  prediction: "#14b8a6",
  grid: "#e2e8f0",
  text: "#64748b",
} as const;

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

const commonChartProps = {
  margin: { top: 10, right: 30, left: 0, bottom: 0 },
  className: "transition-all duration-300 ease-in-out",
};

const commonAxisProps = {
  stroke: CHART_COLORS.text,
  fontSize: 12,
  fontFamily: "Inter, sans-serif",
  tickLine: false,
};

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

  const handleMetricToggle = useCallback((metric: string) => {
    setSelectedMetrics(prev => 
      prev.includes(metric) 
        ? prev.filter(m => m !== metric)
        : [...prev, metric]
    );
  }, []);

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
      })) as FinancialMarketMetric[];
    },
    refetchInterval: 60000, // Refresh every minute
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
      })) as HousingMarketData[];
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
      })) as MiningSectorInsight[];
    },
  });

  const isLoading = isLoadingFinancial || isLoadingHousing || isLoadingMining;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const prediction = payload[0]?.payload?.predicted_change ? {
        value: payload[0].payload.predicted_change,
        confidence: payload[0].payload.prediction_confidence,
        explanation: payload[0].payload.prediction_explanation,
        factors: payload[0].payload.prediction_factors,
      } : undefined;

      return (
        <ChartTooltip prediction={prediction}>
          <div className="bg-white p-4 border rounded-lg shadow-lg">
            <p className="font-semibold mb-2">
              {new Date(label).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex justify-between items-center mb-1">
                <span className="font-medium text-sm" style={{ color: entry.color }}>
                  {entry.name}:
                </span>
                <span className="ml-4 text-sm">
                  {typeof entry.value === "number"
                    ? entry.dataKey.toLowerCase().includes("percentage")
                      ? `${entry.value.toFixed(2)}%`
                      : entry.value.toLocaleString()
                    : entry.value}
                </span>
              </div>
            ))}
          </div>
        </ChartTooltip>
      );
    }
    return null;
  };

  const handleLegendClick = (data: Payload) => {
    if (data.dataKey) {
      handleMetricToggle(data.dataKey.toString());
    }
  };

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

      <div className="grid gap-6">
        {/* Financial Markets Chart */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle>Cryptocurrency Trends</CardTitle>
            <CardDescription>Price movements and predicted changes</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            {isLoadingFinancial ? (
              <Skeleton className="w-full h-full animate-pulse" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={financialData} {...commonChartProps}>
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
                  <XAxis
                    {...commonAxisProps}
                    dataKey="timestamp"
                    tickFormatter={(time) => new Date(time).toLocaleDateString()}
                  />
                  <YAxis
                    {...commonAxisProps}
                    yAxisId="price"
                    tickFormatter={(value) => (
                      new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }).format(value)
                    )}
                  />
                  <YAxis
                    {...commonAxisProps}
                    yAxisId="volume"
                    orientation="right"
                    tickFormatter={(value) => `${(value / 1e9).toFixed(1)}B`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    onClick={handleLegendClick}
                    wrapperStyle={{ fontSize: '12px' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="current_price"
                    stroke={CHART_COLORS.primary}
                    yAxisId="price"
                    name="Price"
                    dot={false}
                    hide={!selectedMetrics.includes("current_price")}
                    animationDuration={300}
                  />
                  <Line
                    type="monotone"
                    dataKey="volume"
                    stroke={CHART_COLORS.secondary}
                    yAxisId="volume"
                    name="Volume"
                    dot={false}
                    hide={!selectedMetrics.includes("volume")}
                    animationDuration={300}
                  />
                  {selectedMetrics.includes("predicted_change") && financialData?.map((item, index) => (
                    item.predicted_change && (
                      <ReferenceArea
                        key={index}
                        x1={item.timestamp}
                        x2={item.prediction_timestamp}
                        y1={item.current_price}
                        y2={item.current_price * (1 + item.predicted_change / 100)}
                        yAxisId="price"
                        fill={CHART_COLORS.prediction}
                        fillOpacity={0.1}
                        stroke={CHART_COLORS.prediction}
                        strokeOpacity={0.3}
                      />
                    )
                  ))}
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Housing Market Chart */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle>Housing Market Overview</CardTitle>
            <CardDescription>Regional price trends and listings</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            {isLoadingHousing ? (
              <Skeleton className="w-full h-full animate-pulse" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={housingData} {...commonChartProps}>
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
                  <XAxis {...commonAxisProps} dataKey="region" />
                  <YAxis {...commonAxisProps} tickFormatter={formatCurrency} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    onClick={handleLegendClick}
                    wrapperStyle={{ fontSize: '12px' }}
                  />
                  <Bar
                    dataKey="avg_price_usd"
                    fill={CHART_COLORS.primary}
                    name="Average Price"
                    hide={!selectedMetrics.includes("avg_price_usd")}
                    animationDuration={300}
                  />
                  <Bar
                    dataKey="listings_active"
                    fill={CHART_COLORS.secondary}
                    name="Active Listings"
                    hide={!selectedMetrics.includes("listings_active")}
                    animationDuration={300}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Mining Sector Chart */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle>Mining Sector Performance</CardTitle>
            <CardDescription>Production and market value trends</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            {isLoadingMining ? (
              <Skeleton className="w-full h-full animate-pulse" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={miningData} {...commonChartProps}>
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
                  <XAxis
                    {...commonAxisProps}
                    dataKey="timestamp"
                    tickFormatter={(time) => new Date(time).toLocaleDateString()}
                  />
                  <YAxis {...commonAxisProps} tickFormatter={formatCurrency} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    onClick={handleLegendClick}
                    wrapperStyle={{ fontSize: '12px' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="market_value_usd"
                    stackId="1"
                    stroke={CHART_COLORS.primary}
                    fill={CHART_COLORS.primary}
                    fillOpacity={0.3}
                    name="Market Value"
                    hide={!selectedMetrics.includes("market_value_usd")}
                    animationDuration={300}
                  />
                  <Area
                    type="monotone"
                    dataKey="production_mt"
                    stackId="2"
                    stroke={CHART_COLORS.secondary}
                    fill={CHART_COLORS.secondary}
                    fillOpacity={0.3}
                    name="Production (MT)"
                    hide={!selectedMetrics.includes("production_mt")}
                    animationDuration={300}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
