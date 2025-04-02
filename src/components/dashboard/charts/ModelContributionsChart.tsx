
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { ModelSettings } from './types/chart-state-types';
import { useBreakpoint } from "@/hooks/use-mobile";

interface ModelContributionData {
  id: string;
  name: string;
  contribution: number;
  prediction: number;
  weight: number;
  color: string;
}

interface ModelContributionsChartProps {
  models: ModelSettings[];
  combinedPrediction: number;
  modelPredictions: Record<string, number>;
}

export const ModelContributionsChart: React.FC<ModelContributionsChartProps> = ({
  models,
  combinedPrediction,
  modelPredictions
}) => {
  const isSmall = useBreakpoint('sm');
  
  // Prepare data for the chart
  const enabledModels = models.filter(model => model.enabled);
  const data: ModelContributionData[] = enabledModels.map(model => ({
    id: model.id,
    name: model.name,
    weight: model.weight,
    prediction: modelPredictions[model.id] || 0,
    contribution: (modelPredictions[model.id] || 0) * model.weight,
    color: model.color
  }));
  
  // Sort by contribution (descending)
  data.sort((a, b) => b.contribution - a.contribution);
  
  // Custom tooltip component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const model = payload[0].payload;
      return (
        <div className="bg-white dark:bg-slate-900 p-2 border border-slate-200 dark:border-slate-800 rounded text-xs">
          <p className="font-bold">{model.name}</p>
          <p>Raw Prediction: {model.prediction.toFixed(2)}</p>
          <p>Weight: {(model.weight * 100).toFixed(0)}%</p>
          <p>Contribution: {model.contribution.toFixed(2)}</p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-center">
          Model Contributions to Combined Prediction
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <>
            <div className="text-center mb-2">
              <span className="text-sm font-medium text-muted-foreground">Combined Prediction:</span>
              <span className="ml-2 text-lg font-bold">{combinedPrediction.toFixed(2)}</span>
            </div>
            <ResponsiveContainer width="100%" height={isSmall ? 200 : 240}>
              <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <XAxis type="number" />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={100}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="contribution" name="Contribution">
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </>
        ) : (
          <div className="text-center py-10 text-muted-foreground">
            No enabled models to display
          </div>
        )}
      </CardContent>
    </Card>
  );
};
