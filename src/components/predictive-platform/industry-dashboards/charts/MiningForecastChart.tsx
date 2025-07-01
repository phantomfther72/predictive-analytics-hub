
import React from 'react';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format, addMonths } from 'date-fns';
import { DataPoint, Forecast } from '@/hooks/usePredictiveData';

interface MiningForecastChartProps {
  forecasts: Forecast[];
  dataPoints: DataPoint[];
  timeframe: string;
}

export const MiningForecastChart: React.FC<MiningForecastChartProps> = ({ 
  forecasts, 
  dataPoints, 
  timeframe 
}) => {
  const chartData = React.useMemo(() => {
    const now = new Date();
    const forecastData = [];
    
    // Create forecast data for next 12 months
    for (let i = 0; i < 12; i++) {
      const futureDate = addMonths(now, i);
      const monthKey = format(futureDate, 'MMM yyyy');
      
      // Get relevant forecasts for this period
      const monthForecasts = forecasts.filter(f => {
        const forecastMonth = format(new Date(f.forecast_date), 'MMM yyyy');
        return forecastMonth === monthKey;
      });
      
      // Calculate average prediction and confidence
      const avgPrediction = monthForecasts.length > 0 
        ? monthForecasts.reduce((sum, f) => sum + f.prediction, 0) / monthForecasts.length
        : 0;
      
      const avgConfidence = monthForecasts.length > 0
        ? monthForecasts.reduce((sum, f) => sum + (f.confidence_interval || 0), 0) / monthForecasts.length
        : 0;
      
      // Get current production baseline (use last known data point)
      const baselineProduction = dataPoints
        .filter(dp => dp.metric_name.includes('production'))
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0]?.value || 1000000;
      
      // Calculate predicted production based on percentage change
      const predictedProduction = baselineProduction * (1 + avgPrediction / 100);
      
      forecastData.push({
        month: monthKey,
        date: futureDate,
        prediction: avgPrediction,
        confidence: avgConfidence * 100,
        predictedProduction: predictedProduction / 1000000, // Convert to millions
        baselineProduction: baselineProduction / 1000000,
        upperBound: predictedProduction * (1 + avgConfidence) / 1000000,
        lowerBound: predictedProduction * (1 - avgConfidence) / 1000000,
      });
    }
    
    return forecastData;
  }, [forecasts, dataPoints]);

  if (chartData.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center text-slate-400">
        No forecast data available
      </div>
    );
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="month" 
            stroke="#9CA3AF"
            fontSize={12}
          />
          <YAxis 
            yAxisId="production"
            orientation="left"
            stroke="#9CA3AF"
            fontSize={12}
            tickFormatter={(value) => `${value.toFixed(1)}M`}
          />
          <YAxis 
            yAxisId="confidence"
            orientation="right"
            stroke="#9CA3AF"
            fontSize={12}
            tickFormatter={(value) => `${value.toFixed(0)}%`}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#F9FAFB'
            }}
            formatter={(value: number, name: string) => {
              if (name === 'confidence') return [`${value.toFixed(1)}%`, 'Confidence'];
              if (name === 'prediction') return [`${value.toFixed(1)}%`, 'Growth Forecast'];
              return [`${value.toFixed(2)}M tons`, name];
            }}
          />
          <Legend />
          
          {/* Production bars */}
          <Bar 
            yAxisId="production"
            dataKey="predictedProduction" 
            fill="#3B82F6" 
            opacity={0.6}
            name="Predicted Production"
          />
          <Bar 
            yAxisId="production"
            dataKey="baselineProduction" 
            fill="#6B7280" 
            opacity={0.3}
            name="Current Production"
          />
          
          {/* Prediction percentage line */}
          <Line
            yAxisId="confidence"
            type="monotone"
            dataKey="prediction"
            stroke="#10B981"
            strokeWidth={3}
            dot={{ fill: '#10B981', strokeWidth: 2, r: 5 }}
            name="Growth Prediction %"
          />
          
          {/* Confidence line */}
          <Line
            yAxisId="confidence"
            type="monotone"
            dataKey="confidence"
            stroke="#F59E0B"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ fill: '#F59E0B', strokeWidth: 2, r: 3 }}
            name="Confidence Level"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
