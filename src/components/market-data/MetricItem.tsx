
import React from "react";
import { MarketMetric } from "@/types/market";
import PredictionIndicator from "./PredictionIndicator";

interface MetricItemProps {
  metric: MarketMetric;
}

const MetricItem: React.FC<MetricItemProps> = ({ metric }) => {
  return (
    <div className="border-b border-gray-100 last:border-0 pb-3 last:pb-0">
      <p className="text-sm font-medium text-gray-600">
        {metric.metric_name}
      </p>
      <div className="flex justify-between items-baseline mt-1">
        <p className="text-2xl font-bold">
          {typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}
        </p>
        <span className="text-sm text-gray-500">
          {metric.source}
        </span>
      </div>
      <p className="text-xs text-gray-400 mt-1">
        Updated: {new Date(metric.timestamp).toLocaleDateString()}
      </p>
      {(metric.predicted_change !== undefined || metric.prediction_confidence !== undefined) && (
        <div className="mt-2">
          <PredictionIndicator 
            predictedChange={metric.predicted_change} 
            predictionConfidence={metric.prediction_confidence}
            showIcon={true}
            showLabel={true}
            showConfidence={true}
            variant="text"
            size="sm"
          />
        </div>
      )}
    </div>
  );
};

export default MetricItem;
