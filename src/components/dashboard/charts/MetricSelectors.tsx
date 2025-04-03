
import React from "react";
import { MetricSelector } from "./MetricSelector";
import { 
  FINANCIAL_METRICS, 
  HOUSING_METRICS, 
  MINING_METRICS, 
  AGRICULTURE_METRICS, 
  GREEN_HYDROGEN_METRICS,
  Metric
} from "./chart-config";

interface MetricSelectorsProps {
  selectedMetricKeys: string[];
  onMetricToggle: (metricKey: string) => void;
  financialData: any[] | undefined;
  housingData: any[] | undefined;
  miningData: any[] | undefined;
  agricultureData: any[] | undefined;
  hydrogenData: any[] | undefined;
}

export const MetricSelectors: React.FC<MetricSelectorsProps> = ({
  selectedMetricKeys,
  onMetricToggle,
  financialData,
  housingData,
  miningData,
  agricultureData,
  hydrogenData
}) => {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      {financialData && financialData.length > 0 && (
        <MetricSelector
          metrics={FINANCIAL_METRICS}
          selectedMetrics={selectedMetricKeys}
          onMetricToggle={onMetricToggle}
        />
      )}
      {housingData && housingData.length > 0 && (
        <MetricSelector
          metrics={HOUSING_METRICS}
          selectedMetrics={selectedMetricKeys}
          onMetricToggle={onMetricToggle}
        />
      )}
      {miningData && miningData.length > 0 && (
        <MetricSelector
          metrics={MINING_METRICS}
          selectedMetrics={selectedMetricKeys}
          onMetricToggle={onMetricToggle}
        />
      )}
      {agricultureData && agricultureData.length > 0 && (
        <MetricSelector
          metrics={AGRICULTURE_METRICS}
          selectedMetrics={selectedMetricKeys}
          onMetricToggle={onMetricToggle}
        />
      )}
      {hydrogenData && hydrogenData.length > 0 && (
        <MetricSelector
          metrics={GREEN_HYDROGEN_METRICS}
          selectedMetrics={selectedMetricKeys}
          onMetricToggle={onMetricToggle}
        />
      )}
    </div>
  );
};
