
import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from "recharts";
import { CHART_COLORS } from "../dashboard/charts/chart-constants";
import { type FinancialMarketMetric } from "@/types/market";
import { useIsMobile } from "@/hooks/use-mobile";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown } from "lucide-react";

interface PredictionChartProps {
  data: FinancialMarketMetric[] | undefined;
  isLoading?: boolean;
}

export const PredictionChart: React.FC<PredictionChartProps> = ({ data, isLoading = false }) => {
  const isMobile = useIsMobile();
  
  if (isLoading) {
    return <Skeleton className="h-[300px] w-full rounded-lg" />;
  }

  // Filter to show only BTC data and ensure it's sorted by date
  const chartData = React.useMemo(() => {
    if (!data) return [];
    return [...data]
      .filter(item => item.asset === 'BTC')
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [data]);

  // Calculate the average predicted change for display
  const averagePrediction = React.useMemo(() => {
    if (!chartData.length) return 0;
    const predictedChanges = chartData
      .filter(item => item.predicted_change !== null)
      .map(item => item.predicted_change as number);
    
    if (!predictedChanges.length) return 0;
    return predictedChanges.reduce((sum, val) => sum + val, 0) / predictedChanges.length;
  }, [chartData]);

  const isPredictionPositive = averagePrediction >= 0;

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <Card className="bg-slate-950/50 border-slate-800 shadow-lg animate-fade-in overflow-hidden">
      <CardHeader className="pb-1">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-white font-poppins tracking-tight">Price Predictions</CardTitle>
          <div className="flex items-center gap-2">
            <div className={`px-2 py-0.5 rounded flex items-center gap-1 text-xs font-medium ${
              isPredictionPositive ? 'bg-green-950/40 text-green-400' : 'bg-red-950/40 text-red-400'
            }`}>
              {isPredictionPositive ? (
                <TrendingUp size={14} />
              ) : (
                <TrendingDown size={14} />
              )}
              <span>{averagePrediction.toFixed(2)}% predicted change</span>
            </div>
            <CardDescription className="text-xs text-slate-400">
              Confidence: {((chartData[0]?.prediction_confidence || 0) * 100).toFixed(0)}%
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className={`h-[${isMobile ? '250px' : '300px'}]`}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
              <XAxis 
                dataKey="timestamp"
                tickFormatter={(time) => new Date(time).toLocaleDateString()}
                stroke={CHART_COLORS.text}
                tick={{ fontSize: isMobile ? 10 : 12 }}
              />
              <YAxis 
                stroke={CHART_COLORS.text} 
                tick={{ fontSize: isMobile ? 10 : 12 }}
                tickFormatter={formatPrice}
              />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  formatPrice(value),
                  name === 'Predicted' ? 'Predicted Price' : 'Current Price'
                ]}
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
              <Line 
                type="monotone" 
                dataKey="current_price" 
                name="Price" 
                stroke={CHART_COLORS.primary} 
                dot={false}
                strokeWidth={2}
                animationDuration={1000}
              />
              <Line 
                type="monotone" 
                dataKey={(data) => data.current_price * (1 + (data.predicted_change || 0) / 100)} 
                name="Predicted" 
                stroke={CHART_COLORS.prediction}
                strokeDasharray="5 5"
                dot={false}
                strokeWidth={2}
                animationDuration={1500}
              />
              {/* Add reference line for current date */}
              <ReferenceLine
                x={chartData.length > 1 ? chartData[Math.floor(chartData.length / 3)].timestamp : undefined}
                stroke="#4a5568"
                strokeDasharray="3 3"
                label={{ value: 'Today', fill: '#a0aec0', fontSize: 12 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
