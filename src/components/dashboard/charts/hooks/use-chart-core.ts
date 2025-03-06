
import { useState, useEffect } from 'react';
import { useSearchParams } from "react-router-dom";
import { Metric } from "../chart-config";
import { TimeRange, Dataset, ChartData } from "../types/chart-types";

export const useChartCore = (initialDataset: Dataset = "financial", initialMetric = "price") => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [timeRange, setTimeRange] = useState<TimeRange>((searchParams.get("timeRange") as TimeRange) || "1M");
  const [selectedMetrics, setSelectedMetrics] = useState<Metric[]>([]);
  const [selectedDataset, setSelectedDataset] = useState<Dataset>(
    (searchParams.get("dataset") as Dataset) || initialDataset
  );
  const [selectedMetric, setSelectedMetric] = useState<string>(
    searchParams.get("metric") || initialMetric
  );
  const [layout, setLayout] = useState<"line" | "bar" | "scatter">("line");
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleLegendClick = (metric: Metric) => {
    setSelectedMetric(metric.key);
  };

  const handleMetricToggle = (metric: Metric) => {
    setSelectedMetrics(prev =>
      prev.find(m => m.key === metric.key)
        ? prev.filter(m => m.key !== metric.key)
        : [...prev, metric]
    );
  };

  // Update search params when time range or dataset changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    params.set("timeRange", timeRange);
    params.set("dataset", selectedDataset);
    setSearchParams(params);
  }, [timeRange, selectedDataset, searchParams, setSearchParams]);

  return {
    timeRange,
    setTimeRange,
    selectedMetrics,
    selectedDataset,
    setSelectedDataset,
    selectedMetric,
    setSelectedMetric,
    layout,
    setLayout,
    chartData,
    isLoading,
    handleLegendClick,
    handleMetricToggle,
  };
};
