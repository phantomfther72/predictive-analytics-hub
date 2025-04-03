
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { CHART_COLORS } from "../dashboard/charts/chart-constants";
import { type FinancialMarketMetric } from "@/types/market";

interface VolumeChartProps {
  data: FinancialMarketMetric[] | undefined;
}

export const VolumeChart: React.FC<VolumeChartProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Trading Volume</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data?.filter(item => item.asset === 'BTC')}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
              <XAxis 
                dataKey="timestamp"
                tickFormatter={(time) => new Date(time).toLocaleDateString()}
                stroke={CHART_COLORS.text}
              />
              <YAxis 
                tickFormatter={(value) => `$${(value / 1e9).toFixed(1)}B`} 
                stroke={CHART_COLORS.text}
              />
              <Tooltip contentStyle={{ backgroundColor: '#1a2234', border: '1px solid #2a3649', color: 'white' }} />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="volume" 
                name="Volume" 
                stroke={CHART_COLORS.secondary}
                fill={CHART_COLORS.secondary}
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
