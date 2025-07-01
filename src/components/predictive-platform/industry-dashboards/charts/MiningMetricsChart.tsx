
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format } from 'date-fns';
import { DataPoint } from '@/hooks/usePredictiveData';

interface MiningMetricsChartProps {
  data: DataPoint[];
  timeframe: string;
}

export const MiningMetricsChart: React.FC<MiningMetricsChartProps> = ({ data, timeframe }) => {
  const chartData = React.useMemo(() => {
    // Group data by timestamp and create chart points
    const groupedData = data.reduce((acc, point) => {
      const date = format(new Date(point.timestamp), 'MMM yyyy');
      if (!acc[date]) {
        acc[date] = { date, timestamp: point.timestamp };
      }
      
      // Use metric name as key, but simplify it
      const metricKey = point.metric_name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
      acc[date][metricKey] = point.value;
      
      return acc;
    }, {} as Record<string, any>);

    return Object.values(groupedData).sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  }, [data]);

  const getMetricColor = (index: number) => {
    const colors = [
      '#3B82F6', // Blue
      '#10B981', // Green  
      '#F59E0B', // Amber
      '#EF4444', // Red
      '#8B5CF6', // Purple
      '#06B6D4', // Cyan
    ];
    return colors[index % colors.length];
  };

  // Get all metric keys except date and timestamp
  const metricKeys = React.useMemo(() => {
    if (chartData.length === 0) return [];
    return Object.keys(chartData[0]).filter(key => 
      key !== 'date' && key !== 'timestamp'
    );
  }, [chartData]);

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-400">
        No data available for the selected timeframe
      </div>
    );
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="date" 
            stroke="#9CA3AF"
            fontSize={12}
          />
          <YAxis 
            stroke="#9CA3AF"
            fontSize={12}
            tickFormatter={(value) => {
              if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
              if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
              return value.toString();
            }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#F9FAFB'
            }}
            formatter={(value: number) => {
              if (value >= 1000000) return [`${(value / 1000000).toFixed(2)}M`, ''];
              if (value >= 1000) return [`${(value / 1000).toFixed(2)}K`, ''];
              return [value.toFixed(2), ''];
            }}
          />
          <Legend />
          {metricKeys.map((key, index) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={getMetricColor(index)}
              strokeWidth={2}
              dot={{ fill: getMetricColor(index), strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: getMetricColor(index), strokeWidth: 2 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
