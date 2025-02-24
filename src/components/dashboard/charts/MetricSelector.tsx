
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export interface Metric {
  key: string;
  name: string;
  color: string;
}

interface MetricSelectorProps {
  metrics: Metric[];
  selectedMetrics: string[];
  onMetricToggle: (metric: string) => void;
}

export function MetricSelector({ metrics, selectedMetrics, onMetricToggle }: MetricSelectorProps) {
  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">Select Metrics</Label>
      <div className="grid grid-cols-2 gap-4">
        {metrics.map((metric) => (
          <div key={metric.key} className="flex items-center space-x-2">
            <Checkbox
              id={metric.key}
              checked={selectedMetrics.includes(metric.key)}
              onCheckedChange={() => onMetricToggle(metric.key)}
            />
            <Label
              htmlFor={metric.key}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              style={{ color: metric.color }}
            >
              {metric.name}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
}
