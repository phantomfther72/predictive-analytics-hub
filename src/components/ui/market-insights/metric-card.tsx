
import React from "react";
import type { InsightMetric } from "./types";

interface MetricCardProps {
  metric: InsightMetric;
}

export const MetricCard: React.FC<MetricCardProps> = ({ metric }) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
      <p className="text-sm font-medium text-gray-500">{metric.label}</p>
      <p className="text-3xl font-bold mt-1">
        {typeof metric.value === "number"
          ? metric.value >= 1000
            ? metric.value.toLocaleString()
            : metric.value.toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 1,
              })
          : metric.value}
      </p>
      <p
        className={`text-sm font-medium mt-2 ${
          metric.change && metric.change > 0
            ? "text-green-600"
            : metric.change && metric.change < 0
            ? "text-red-600"
            : "text-gray-500"
        }`}
      >
        {metric.change !== undefined && metric.change !== null ? (
          <>
            {metric.change > 0 ? "+" : ""}
            {metric.change.toFixed(1)}% predicted
          </>
        ) : (
          <span className="text-gray-500">No change predicted</span>
        )}
      </p>
    </div>
  );
};
