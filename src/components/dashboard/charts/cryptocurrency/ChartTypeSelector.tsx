
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  AreaChart as AreaChartIcon, 
  LineChart as LineChartIcon, 
  BarChart3, 
  Activity
} from "lucide-react";
import { ChartType } from "./CryptocurrencyChart";

interface ChartTypeSelectorProps {
  chartType: ChartType;
  onChartTypeChange: (type: ChartType) => void;
}

export function ChartTypeSelector({ chartType, onChartTypeChange }: ChartTypeSelectorProps) {
  return (
    <div className="flex justify-end gap-2 mb-2">
      <Button 
        variant={chartType === 'area' ? 'default' : 'outline'} 
        size="sm" 
        onClick={() => onChartTypeChange('area')}
        className="flex items-center gap-1 transition-all duration-200"
      >
        <AreaChartIcon size={14} />
        <span className="hidden sm:inline">Area</span>
      </Button>
      <Button 
        variant={chartType === 'line' ? 'default' : 'outline'} 
        size="sm" 
        onClick={() => onChartTypeChange('line')}
        className="flex items-center gap-1 transition-all duration-200"
      >
        <LineChartIcon size={14} />
        <span className="hidden sm:inline">Line</span>
      </Button>
      <Button 
        variant={chartType === 'bar' ? 'default' : 'outline'} 
        size="sm" 
        onClick={() => onChartTypeChange('bar')}
        className="flex items-center gap-1 transition-all duration-200"
      >
        <BarChart3 size={14} />
        <span className="hidden sm:inline">Bar</span>
      </Button>
      <Button 
        variant={chartType === 'composed' ? 'default' : 'outline'} 
        size="sm" 
        onClick={() => onChartTypeChange('composed')}
        className="flex items-center gap-1 transition-all duration-200"
      >
        <Activity size={14} />
        <span className="hidden sm:inline">Mixed</span>
      </Button>
    </div>
  );
}
