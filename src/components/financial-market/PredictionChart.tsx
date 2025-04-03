
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { CHART_COLORS } from "../dashboard/charts/chart-constants";
import { type FinancialMarketMetric } from "@/types/market";

interface PredictionChartProps {
  data: FinancialMarketMetric[] | undefined;
}

export const PredictionChart: React.FC<PredictionChartProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Price Predictions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data?.filter(item => item.asset === 'BTC')}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
              <XAxis 
                dataKey="timestamp"
                tickFormatter={(time) => new Date(time).toLocaleDateString()}
                stroke={CHART_COLORS.text}
              />
              <YAxis stroke={CHART_COLORS.text} />
              <Tooltip contentStyle={{ backgroundColor: '#1a2234', border: '1px solid #2a3649', color: 'white' }} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="current_price" 
                name="Price" 
                stroke={CHART_COLORS.primary} 
                dot={false}
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey={(data) => data.current_price * (1 + (data.predicted_change / 100))} 
                name="Predicted" 
                stroke={CHART_COLORS.prediction}
                strokeDasharray="5 5"
                dot={false}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
