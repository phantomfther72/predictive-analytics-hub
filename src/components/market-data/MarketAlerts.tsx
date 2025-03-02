
import React from "react";
import { MarketMetric } from "@/types/market";

interface MarketAlertsProps {
  metrics: MarketMetric[];
}

const MarketAlerts: React.FC<MarketAlertsProps> = ({ metrics }) => {
  return (
    <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4">Market Alerts</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.slice(0, 3).map((metric) => (
          <div
            key={metric.id}
            className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <p className="text-sm font-medium text-gray-600">
              {metric.metric_name}
            </p>
            <p className="text-lg font-bold mt-1">
              {typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}
            </p>
            <p className="text-xs text-gray-500 mt-1">{metric.source}</p>
            {metric.predicted_change !== undefined && (
              <p className={`text-xs font-medium ${Number(metric.predicted_change) > 0 ? 'text-green-600' : 'text-red-600'} mt-1`}>
                Predicted change: {Number(metric.predicted_change) > 0 ? '+' : ''}{metric.predicted_change}%
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketAlerts;
