
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface TimeRangeSelectorProps {
  activeTimeRange: "7d" | "30d" | "90d" | "1y" | "all";
  setActiveTimeRange: (timeRange: "7d" | "30d" | "90d" | "1y" | "all") => void;
}

export const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({
  activeTimeRange,
  setActiveTimeRange
}) => {
  const isMobile = useIsMobile();
  const timeRanges = [
    { value: "7d", label: "7D" },
    { value: "30d", label: "30D" },
    { value: "90d", label: "90D" },
    { value: "1y", label: "1Y" },
    { value: "all", label: "All" }
  ];

  return (
    <div className="flex space-x-1 bg-slate-800/60 p-1 rounded-md border border-slate-700 shadow-md animate-fade-in">
      {timeRanges.map(range => (
        <Button
          key={range.value}
          variant="ghost"
          size="sm"
          onClick={() => setActiveTimeRange(range.value as any)}
          className={cn(
            "text-xs px-2 py-1 h-auto transition-all duration-200",
            activeTimeRange === range.value
              ? "bg-white dark:bg-slate-600 shadow-sm text-slate-900 dark:text-white"
              : "hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300"
          )}
        >
          {range.label}
        </Button>
      ))}
    </div>
  );
};
