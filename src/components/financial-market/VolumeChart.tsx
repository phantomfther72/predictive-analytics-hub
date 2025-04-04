
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { CHART_COLORS } from "../dashboard/charts/chart-constants";
import { type FinancialMarketMetric } from "@/types/market";
import { useIsMobile } from "@/hooks/use-mobile";
import { Skeleton } from "@/components/ui/skeleton";

interface VolumeChartProps {
  data: FinancialMarketMetric[] | undefined;
  isLoading?: boolean;
}

export const VolumeChart: React.FC<VolumeChartProps> = ({ data, isLoading = false }) => {
  const isMobile = useIsMobile();
  
  // Always process chart data regardless of loading state
  const chartData = React.useMemo(() => {
    if (!data) return [];
    return [...data]
      .filter(item => item.asset === 'BTC')
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [data]);

  const formatVolume = (value: number) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    return `$${value.toLocaleString()}`;
  };

  if (isLoading) {
    return <Skeleton className="h-[300px] w-full rounded-lg" />;
  }

  return (
    <Card className="bg-slate-950/50 border-slate-800 shadow-lg animate-fade-in">
      <CardHeader className="pb-2">
        <CardTitle className="text-white font-poppins tracking-tight">Trading Volume</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
              <XAxis 
                dataKey="timestamp"
                tickFormatter={(time) => new Date(time).toLocaleDateString()}
                stroke={CHART_COLORS.text}
                tick={{ fontSize: isMobile ? 10 : 12 }}
              />
              <YAxis 
                tickFormatter={(value) => formatVolume(value)}
                stroke={CHART_COLORS.text}
                tick={{ fontSize: isMobile ? 10 : 12 }}
              />
              <Tooltip 
                formatter={(value: number) => [formatVolume(value), 'Volume']}
                labelFormatter={(label) => `Date: ${new Date(label).toLocaleDateString()}`}
                contentStyle={{ 
                  backgroundColor: '#1a2234', 
                  border: '1px solid #2a3649', 
                  color: 'white',
                  borderRadius: '4px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                }}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="volume" 
                name="Trading Volume" 
                stroke={CHART_COLORS.secondary}
                fill={CHART_COLORS.secondary}
                fillOpacity={0.3}
                strokeWidth={2}
                activeDot={{ r: 6, strokeWidth: 1, stroke: '#fff' }}
                animationDuration={1200}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
