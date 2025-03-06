import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import {
  FINANCIAL_METRICS,
  HOUSING_METRICS,
  MINING_METRICS,
  AGRICULTURE_METRICS,
  GREEN_HYDROGEN_METRICS,
  Metric,
} from "./chart-config";
import { useMarketData } from "../tables/useMarketData";

// Define the types for the chart state
type TimeRange = "1D" | "1W" | "1M" | "3M" | "6M" | "1Y" | "ALL";
type Dataset = "financial" | "housing" | "mining" | "agriculture" | "green_hydrogen";
type Layout = "line" | "bar" | "scatter";

// Define the initial chart layout
const initialLayout: Layout = "line";

// Define the initial models
const initialModels = [
  { id: "model1", name: "Model 1", weight: 0.5, visible: true, setting1: "value1", setting2: "value2" },
  { id: "model2", name: "Model 2", weight: 0.3, visible: false, setting1: "value3", setting2: "value4" },
  { id: "model3", name: "Model 3", weight: 0.2, visible: true, setting1: "value5", setting2: "value6" },
];

// Function to generate random chart data
const generateChartData = (dataset: Dataset, timeRange: TimeRange, selectedMetrics: Metric[]) => {
  const numPoints = 50; // Number of data points to generate
  const now = new Date();
  const data = [];

  for (let i = 0; i < numPoints; i++) {
    const timestamp = new Date(now.getTime() - i * 24 * 60 * 60 * 1000); // Generate daily data points
    const dataPoint: { timestamp: string; [key: string]: number } = { timestamp: timestamp.toISOString() };

    selectedMetrics.forEach(metric => {
      dataPoint[metric.key] = Math.random() * 100; // Generate random data for each selected metric
    });

    data.push(dataPoint);
  }

  return data;
};

// Function to create chart state with selected dataset
export function useChartState(initialDataset = "financial", initialMetric = "price") {
  const [searchParams, setSearchParams] = useSearchParams();
  const [timeRange, setTimeRange] = useState<TimeRange>((searchParams.get("timeRange") as TimeRange) || "1M");
  const [selectedMetrics, setSelectedMetrics] = useState<Metric[]>(() => {
    const dataset = (searchParams.get("dataset") as Dataset) || initialDataset;
    switch (dataset) {
      case "financial":
        return FINANCIAL_METRICS.slice(0, 2);
      case "housing":
        return HOUSING_METRICS.slice(0, 2);
      case "mining":
        return MINING_METRICS.slice(0, 2);
      case "agriculture":
        return AGRICULTURE_METRICS.slice(0, 2);
      case "green_hydrogen":
        return GREEN_HYDROGEN_METRICS.slice(0, 2);
      default:
        return FINANCIAL_METRICS.slice(0, 2);
    }
  });
  const [selectedDataset, setSelectedDataset] = useState<Dataset>(
    (searchParams.get("dataset") as Dataset) || (initialDataset as Dataset)
  );
  const [selectedMetric, setSelectedMetric] = useState<string>(
    (searchParams.get("metric") as string) || initialMetric
  );
  const [layout, setLayout] = useState<Layout>(initialLayout);
  const [chartData, setChartData] = useState(() => generateChartData(selectedDataset, timeRange, selectedMetrics));
  const [isLoading, setIsLoading] = useState(false);
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
  } = useMarketData();

  // Function to handle legend click
  const handleLegendClick = (metric: string) => {
    setSelectedMetric(metric);
  };

  // Function to handle metric toggle
  const handleMetricToggle = (metric: Metric) => {
    setSelectedMetrics((prevMetrics) => {
      if (prevMetrics.find((m) => m.key === metric.key)) {
        return prevMetrics.filter((m) => m.key !== metric.key);
      } else {
        return [...prevMetrics, metric];
      }
    });
  };

  // Update chart data when dataset or time range changes
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setChartData(generateChartData(selectedDataset, timeRange, selectedMetrics));
      setIsLoading(false);
    }, 500);
  }, [selectedDataset, timeRange, selectedMetrics]);

  // Update search params when time range or dataset changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    params.set("timeRange", timeRange);
    params.set("dataset", selectedDataset);
    setSearchParams(params);
  }, [timeRange, selectedDataset, searchParams, setSearchParams]);

  // Return the chart state object
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
  };
}

// Function to create annotation state
export function useAnnotations() {
  const [annotations, setAnnotations] = useState([
    {
      id: "annotation1",
      timestamp: new Date().toISOString(),
      content: "This is an example annotation",
      author: "John Doe",
      replies: [
        {
          id: "reply1",
          timestamp: new Date().toISOString(),
          content: "This is a reply to the annotation",
          author: "Jane Smith",
        },
      ],
    },
  ]);
  const [selectedAnnotation, setSelectedAnnotation] = useState<string | null>(null);

  // Function to add a new annotation
  const addAnnotation = (timestamp: string, content: string, author: string) => {
    const newAnnotation = {
      id: `annotation${annotations.length + 1}`,
      timestamp,
      content,
      author,
      replies: [],
    };
    setAnnotations((prev) => [...prev, newAnnotation]);
  };

  // Function to add a reply to an annotation
  const addReplyToAnnotation = (annotationId: string, content: string, author: string) => {
    setAnnotations((prev) =>
      prev.map((annotation) => {
        if (annotation.id === annotationId) {
          const newReply = {
            id: `reply${annotation.replies.length + 1}`,
            timestamp: new Date().toISOString(),
            content,
            author,
          };
          return { ...annotation, replies: [...annotation.replies, newReply] };
        }
        return annotation;
      })
    );
  };

  return {
    annotations,
    selectedAnnotation,
    setSelectedAnnotation,
    addAnnotation,
    addReplyToAnnotation,
    updateAnnotation: (id: string, content: string) => {
      // Implementation for updating an annotation
      setAnnotations(prev => 
        prev.map(ann => 
          ann.id === id 
            ? { ...ann, content, lastUpdated: new Date().toISOString() } 
            : ann
        )
      );
    },
    deleteAnnotation: (id: string) => {
      // Implementation for deleting an annotation
      setAnnotations(prev => prev.filter(ann => ann.id !== id));
    }
  };
}

// Function to create model comparison state
export function useModelComparison() {
  const [models, setModels] = useState(initialModels);

  // Function to toggle model enabled
  const toggleModelEnabled = (modelId: string) => {
    setModels((prev) =>
      prev.map((model) => (model.id === modelId ? { ...model, enabled: !model.enabled } : model))
    );
  };

  // Function to update model weight
  const updateModelWeight = (modelId: string, weight: number) => {
    setModels((prev) =>
      prev.map((model) => (model.id === modelId ? { ...model, weight } : model))
    );
  };

  return {
    models,
    modelSettings: models,
    toggleModelEnabled,
    updateModelWeight,
    updateModelSetting: (modelId: string, setting: string, value: any) => {
      // Implementation for updating a model setting
      setModels(prev => 
        prev.map(model => 
          model.id === modelId 
            ? { ...model, [setting]: value } 
            : model
        )
      );
    },
    toggleModelVisibility: (modelId: string) => {
      // Implementation for toggling model visibility
      setModels(prev => 
        prev.map(model => 
          model.id === modelId 
            ? { ...model, visible: !model.visible } 
            : model
        )
      );
    },
    resetModelSettings: () => {
      // Implementation for resetting model settings
      setModels(initialModels);
    }
  };
}
