
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { CHART_COLORS } from "../dashboard/charts/chart-constants";
import { Skeleton } from "@/components/ui/skeleton";
import { type FinancialMarketMetric } from "@/types/market";

interface PriceChartProps {
  financialData: FinancialMarketMetric[] | undefined;
  isLoading: boolean;
  assetData: Record<string, FinancialMarketMetric[]>;
}

export const PriceChart: React.FC<PriceChartProps> = ({ 
  financialData, 
  isLoading, 
  assetData 
}) => {
  if (isLoading) {
    return <Skeleton className="h-[400px] w-full" />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Price Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={financialData}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
              <XAxis 
                dataKey="timestamp"
                tickFormatter={(time) => new Date(time).toLocaleDateString()}
                stroke={CHART_COLORS.text}
              />
              <YAxis 
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} 
                stroke={CHART_COLORS.text}
              />
              <Tooltip 
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Price']}
                labelFormatter={(label) => `Date: ${new Date(label).toLocaleDateString()}`}
                contentStyle={{ backgroundColor: '#1a2234', border: '1px solid #2a3649', color: 'white' }}
              />
              <Legend />
              {Object.keys(assetData).map((asset, index) => (
                <Line 
                  key={asset}
                  type="monotone"
                  dataKey="current_price"
                  data={assetData[asset]}
                  name={asset}
                  stroke={Object.values(CHART_COLORS)[index % Object.values(CHART_COLORS).length]}
                  dot={false}
                  strokeWidth={2}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
