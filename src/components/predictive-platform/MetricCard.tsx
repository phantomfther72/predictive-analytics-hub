
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { DataPoint, Forecast } from '@/hooks/usePredictiveData';

interface MetricCardProps {
  dataPoint: DataPoint;
  forecast?: Forecast;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({ 
  dataPoint, 
  forecast,
  className 
}) => {
  const getTrendIcon = (prediction: number) => {
    if (prediction > 5) return <TrendingUp className="h-4 w-4 text-green-400" />;
    if (prediction < -5) return <TrendingDown className="h-4 w-4 text-red-400" />;
    return <Minus className="h-4 w-4 text-yellow-400" />;
  };

  const getTrendColor = (prediction: number) => {
    if (prediction > 5) return 'bg-green-500/20 text-green-400 border-green-500/30';
    if (prediction < -5) return 'bg-red-500/20 text-red-400 border-red-500/30';
    return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
  };

  return (
    <Card className={`bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300 ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-slate-300">{dataPoint.metric_name}</h3>
          <Badge variant="outline" className="text-xs text-slate-400">
            {dataPoint.region}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-white">
              {typeof dataPoint.value === 'number' 
                ? dataPoint.value.toLocaleString() 
                : dataPoint.value}
            </div>
            <div className="text-xs text-slate-400">{dataPoint.unit}</div>
          </div>
          
          {forecast && (
            <div className="text-right">
              <div className="flex items-center space-x-1">
                {getTrendIcon(forecast.prediction)}
                <span className="text-sm font-medium text-white">
                  {forecast.prediction > 0 ? '+' : ''}
                  {forecast.prediction.toFixed(1)}%
                </span>
              </div>
              <Badge className={`text-xs mt-1 ${getTrendColor(forecast.prediction)}`}>
                {Math.round(forecast.confidence_interval * 100)}% confidence
              </Badge>
            </div>
          )}
        </div>
        
        <div className="mt-3 text-xs text-slate-500">
          Updated: {new Date(dataPoint.timestamp).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  );
};
