
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { CHART_COLORS } from "../dashboard/charts/chart-constants";

interface PlaceholderChartProps {
  title: string;
}

export const PlaceholderChart: React.FC<PlaceholderChartProps> = ({ title }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
            <XAxis stroke={CHART_COLORS.text} />
            <YAxis stroke={CHART_COLORS.text} />
            <Legend />
            <Tooltip contentStyle={{ backgroundColor: '#1a2234', border: '1px solid #2a3649', color: 'white' }} />
            {/* Content will populate after user selects data */}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
