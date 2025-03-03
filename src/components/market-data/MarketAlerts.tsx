
import React from "react";
import { MarketMetric } from "@/types/market";
import PredictionIndicator from "./PredictionIndicator";
import PredictionBadge from "./PredictionBadge";
import PredictionTooltip from "./PredictionTooltip";

interface MarketAlertsProps {
  metrics: MarketMetric[];
}

const MarketAlerts: React.FC<MarketAlertsProps> = ({ metrics }) => {
  return (
    <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4">Market Alerts</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.slice(0, 3).map((metric) => {
          const predictionFactors = metric.prediction_factors || {
            market_trend: 0.7,
            volatility: 0.3,
            sentiment: 0.5
          };
          
          return (
            <div
              key={metric.id}
              className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <p className="text-sm font-medium text-gray-600">
                  {metric.metric_name}
                </p>
                {metric.predicted_change !== undefined && (
                  <PredictionBadge
                    value={metric.predicted_change}
                    confidence={metric.prediction_confidence}
                    size="sm"
                  />
                )}
              </div>
              <p className="text-lg font-bold mt-1">
                {typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}
              </p>
              <p className="text-xs text-gray-500 mt-1">{metric.source}</p>
              
              {metric.predicted_change !== undefined && (
                <PredictionTooltip
                  predictedChange={metric.predicted_change}
                  predictionConfidence={metric.prediction_confidence}
                  factors={predictionFactors}
                  explanation="This prediction is based on historical data patterns and current market conditions."
                  variant="pill"
                  size="sm"
                  className="mt-2"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MarketAlerts;
