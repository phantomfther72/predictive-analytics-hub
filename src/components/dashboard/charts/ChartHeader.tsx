
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, SplitSquareVertical } from "lucide-react";
import { TimeRangeSlider } from "./TimeRangeSlider";
import { TimeRange } from "./types/chart-types";

interface ChartHeaderProps {
  simulationMode: boolean;
  timeRange: string;
  onTimeRangeChange: (value: string) => void;
}

export const ChartHeader: React.FC<ChartHeaderProps> = ({
  simulationMode,
  timeRange,
  onTimeRangeChange
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold">Interactive Analytics</h1>
          {simulationMode && (
            <Badge variant="secondary" className="ml-2 bg-teal-100 text-teal-800">Simulation Mode</Badge>
          )}
        </div>
        <p className="text-muted-foreground mt-1">
          Compare models, run simulations, and collaborate with your team
        </p>
      </div>
      <div className="flex items-center gap-3">
        <TimeRangeSlider value={timeRange} onChange={onTimeRangeChange} />
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          <span>Add Chart</span>
        </Button>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <SplitSquareVertical className="h-4 w-4" />
          <span>Layout</span>
        </Button>
      </div>
    </div>
  );
};
