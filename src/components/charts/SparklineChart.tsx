
import React from "react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  TooltipProps
} from "recharts";
import {
  NameType,
  ValueType
} from "recharts/types/component/DefaultTooltipContent";

interface SparklineChartProps {
  data: number[];
  height?: number;
  color?: string;
  showTooltip?: boolean;
  tooltipSuffix?: string;
}

export const SparklineChart: React.FC<SparklineChartProps> = ({
  data,
  height = 40,
  color = "#3b82f6",
  showTooltip = false,
  tooltipSuffix = ""
}) => {
  // Transform the data for Recharts
  const chartData = data.map((value, index) => ({ 
    value, 
    index 
  }));
  
  const CustomTooltip = ({
    active,
    payload
  }: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-900 shadow-md rounded px-2 py-1 text-xs border border-slate-200 dark:border-slate-700">
          <p className="font-medium">{payload[0].value}{tooltipSuffix}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={chartData}>
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          dot={false}
          animationDuration={1000}
        />
        {showTooltip && <Tooltip content={<CustomTooltip />} cursor={false} />}
      </LineChart>
    </ResponsiveContainer>
  );
};
