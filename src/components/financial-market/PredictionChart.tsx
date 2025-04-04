
import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { CHART_COLORS } from "../dashboard/charts/chart-constants";
import { type FinancialMarketMetric } from "@/types/market";
import { useIsMobile } from "@/hooks/use-mobile";
import { Skeleton } from "@/components/ui/skeleton";

interface PredictionChartProps {
  data: FinancialMarketMetric[] | undefined;
  isLoading?: boolean;
}

export const PredictionChart: React.FC<PredictionChartProps> = ({ data, isLoading = false }) => {
  const isMobile = useIsMobile();
  
  // Always process chart data regardless of loading state
  // Move useMemo hook before any conditional returns to prevent React hook errors
  const chartData = React.useMemo(() => {
    if (!data) return [];
    return [...data]
      .filter(item => item.asset === 'BTC' && item.predicted_change !== null)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      .map(item => ({
        ...item,
        actual_price: item.current_price,
        predicted_price: item.current_price * (1 + (item.predicted_change || 0) / 100)
      }));
  }, [data]);

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  if (isLoading) {
    return <Skeleton className="h-[300px] w-full rounded-lg" />;
  }

  return (
    <Card className="bg-slate-950/50 border-slate-800 shadow-lg animate-fade-in">
      <CardHeader className="pb-2">
        <CardTitle className="text-white font-poppins tracking-tight">Price Predictions</CardTitle>
        <CardDescription className="text-slate-400">
          AI-predicted price trends compared to actual values
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
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
                tickFormatter={(value) => formatPrice(value)}
                stroke={CHART_COLORS.text}
                tick={{ fontSize: isMobile ? 10 : 12 }}
              />
              <Tooltip 
                formatter={(value: number) => [formatPrice(value), 'Price']}
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
                dataKey="actual_price" 
                name="Actual Price" 
                stroke={CHART_COLORS.primary}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 6, strokeWidth: 1, stroke: '#fff' }}
                animationDuration={1200}
              />
              <Line 
                type="monotone" 
                dataKey="predicted_price" 
                name="Predicted Price" 
                stroke={CHART_COLORS.prediction}
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                animationDuration={1500}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
