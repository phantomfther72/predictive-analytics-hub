import React, { useState } from "react";
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
  ResponsiveContainer
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { parsePredictionFactors } from "./tables/PredictionFactorsUtils";
import type { FinancialMarketMetric, HousingMarketData, MiningSectorInsight } from "@/types/market";

const TIME_RANGES = {
  "24h": "24 hours",
  "7d": "7 days",
  "30d": "30 days"
} as const;

type TimeRange = keyof typeof TIME_RANGES;

export const DashboardCharts = () => {
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState<TimeRange>("24h");

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

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded-lg shadow-lg">
          <p className="font-semibold">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm">
              <span className="font-medium" style={{ color: entry.color }}>
                {entry.name}:
              </span>{" "}
              {typeof entry.value === "number"
                ? entry.value.toLocaleString()
                : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Interactive Charts</h1>
        <Select
          value={timeRange}
          onValueChange={(value: TimeRange) => setTimeRange(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(TIME_RANGES).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6">
        {/* Financial Markets Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Cryptocurrency Trends</CardTitle>
            <CardDescription>Price movements and trading volume</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            {isLoadingFinancial ? (
              <Skeleton className="w-full h-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={financialData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="timestamp"
                    tickFormatter={(time) => new Date(time).toLocaleDateString()}
                  />
                  <YAxis
                    yAxisId="price"
                    tickFormatter={formatCurrency}
                  />
                  <YAxis
                    yAxisId="volume"
                    orientation="right"
                    tickFormatter={(value) => `${(value / 1e9).toFixed(1)}B`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="current_price"
                    stroke="#2563eb"
                    yAxisId="price"
                    name="Price"
                  />
                  <Line
                    type="monotone"
                    dataKey="volume"
                    stroke="#16a34a"
                    yAxisId="volume"
                    name="Volume"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Housing Market Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Housing Market Overview</CardTitle>
            <CardDescription>Regional price trends and active listings</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            {isLoadingHousing ? (
              <Skeleton className="w-full h-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={housingData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="region" />
                  <YAxis tickFormatter={formatCurrency} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar
                    dataKey="avg_price_usd"
                    fill="#2563eb"
                    name="Average Price"
                  />
                  <Bar
                    dataKey="listings_active"
                    fill="#16a34a"
                    name="Active Listings"
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Mining Sector Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Mining Sector Performance</CardTitle>
            <CardDescription>Production and market value by commodity</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            {isLoadingMining ? (
              <Skeleton className="w-full h-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={miningData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="timestamp"
                    tickFormatter={(time) => new Date(time).toLocaleDateString()}
                  />
                  <YAxis tickFormatter={formatCurrency} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="market_value_usd"
                    stackId="1"
                    stroke="#2563eb"
                    fill="#2563eb"
                    fillOpacity={0.3}
                    name="Market Value"
                  />
                  <Area
                    type="monotone"
                    dataKey="production_mt"
                    stackId="2"
                    stroke="#16a34a"
                    fill="#16a34a"
                    fillOpacity={0.3}
                    name="Production (MT)"
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
