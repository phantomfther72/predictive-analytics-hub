
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Metric } from "./chart-config";
import { Check } from "lucide-react";

interface MetricSelectorProps {
  metrics: Metric[];
  selectedMetrics: string[];
  onMetricToggle: (metricKey: string) => void;
  className?: string;
}

export function MetricSelector({ 
  metrics, 
  selectedMetrics, 
  onMetricToggle,
  className 
}: MetricSelectorProps) {
  return (
    <div className={cn("inline-flex flex-wrap gap-2", className)}>
      {metrics.map((metric) => {
        const isSelected = selectedMetrics.includes(metric.key);
        return (
          <Button
            key={metric.key}
            variant={isSelected ? "default" : "outline"}
            size="sm"
            className={cn(
              "flex items-center gap-1 text-xs",
              isSelected && `bg-${metric.color}/90 hover:bg-${metric.color}`
            )}
            onClick={() => onMetricToggle(metric.key)}
          >
            {isSelected && <Check className="h-3 w-3" />}
            {metric.name}
            {metric.unit && metric.unit !== "%" && ` (${metric.unit})`}
          </Button>
        );
      })}
    </div>
  );
}
