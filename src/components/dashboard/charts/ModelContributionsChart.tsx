
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface ModelContribution {
  id: string;
  name: string;
  color: string;
  value: number;
  weight: number;
  enabled: boolean;
  contribution: number;
  contributionPercentage: number;
}

interface ModelContributionsChartProps {
  contributions: ModelContribution[];
  isLoading?: boolean;
}

export const ModelContributionsChart: React.FC<ModelContributionsChartProps> = ({
  contributions,
  isLoading = false
}) => {
  // Filter to only enabled models with a positive contribution
  const enabledContributions = contributions
    .filter(model => model.enabled && model.contribution > 0);

  // Format for the pie chart data
  const chartData = enabledContributions.map(model => ({
    name: model.name,
    value: model.contributionPercentage,
    color: model.color,
  }));

  if (isLoading) {
    return <Skeleton className="w-full h-[300px]" />;
  }

  if (enabledContributions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Model Contributions</CardTitle>
          <CardDescription>Relative influence of each model</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[200px]">
          <p className="text-muted-foreground">No active models or contributions</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Model Contributions</CardTitle>
        <CardDescription>Relative influence of each model</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              innerRadius={50}
              paddingAngle={2}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => `${value.toFixed(1)}%`}
              labelFormatter={(label) => `Model: ${label}`}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
