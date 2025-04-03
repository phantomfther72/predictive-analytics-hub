
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TimeRangeSelectorProps {
  activeTimeRange: "7d" | "30d" | "90d" | "1y" | "all";
  setActiveTimeRange: (timeRange: "7d" | "30d" | "90d" | "1y" | "all") => void;
}

export const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({
  activeTimeRange,
  setActiveTimeRange
}) => {
  const timeRanges = [
    { value: "7d", label: "7D" },
    { value: "30d", label: "30D" },
    { value: "90d", label: "90D" },
    { value: "1y", label: "1Y" },
    { value: "all", label: "All" }
  ];

  return (
    <div className="flex space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-md">
      {timeRanges.map(range => (
        <Button
          key={range.value}
          variant="ghost"
          size="sm"
          onClick={() => setActiveTimeRange(range.value as any)}
          className={cn(
            "text-xs px-2 py-1 h-auto",
            activeTimeRange === range.value
              ? "bg-white dark:bg-slate-700 shadow-sm"
              : "hover:bg-slate-200 dark:hover:bg-slate-700"
          )}
        >
          {range.label}
        </Button>
      ))}
    </div>
  );
};
