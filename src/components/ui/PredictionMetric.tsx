import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus, Activity } from 'lucide-react';

interface PredictionMetricProps {
  title: string;
  value: number | string;
  unit?: string;
  prediction?: number;
  confidence?: number;
  region?: string;
  timestamp?: string;
  className?: string;
}

export const PredictionMetric: React.FC<PredictionMetricProps> = ({
  title,
  value,
  unit,
  prediction,
  confidence,
  region,
  timestamp,
  className
}) => {
  const getTrendIcon = (pred: number) => {
    if (pred > 5) return <TrendingUp className="h-4 w-4 text-green-400" />;
    if (pred < -5) return <TrendingDown className="h-4 w-4 text-red-400" />;
    return <Minus className="h-4 w-4 text-yellow-400" />;
  };

  const getTrendColor = (pred: number) => {
    if (pred > 5) return 'bg-green-500/20 text-green-400 border-green-500/30';
    if (pred < -5) return 'bg-red-500/20 text-red-400 border-red-500/30';
    return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
  };

  return (
    <Card className={`bg-card/50 border backdrop-blur-sm hover:bg-card/70 transition-all duration-300 ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Activity className="h-4 w-4" />
            {title}
          </h3>
          {region && (
            <Badge variant="outline" className="text-xs">
              {region}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-foreground">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </div>
            {unit && <div className="text-xs text-muted-foreground">{unit}</div>}
          </div>
          
          {prediction !== undefined && (
            <div className="text-right">
              <div className="flex items-center space-x-1">
                {getTrendIcon(prediction)}
                <span className="text-sm font-medium text-foreground">
                  {prediction > 0 ? '+' : ''}
                  {prediction.toFixed(1)}%
                </span>
              </div>
              {confidence && (
                <Badge className={`text-xs mt-1 ${getTrendColor(prediction)}`}>
                  {Math.round(confidence * 100)}% confidence
                </Badge>
              )}
            </div>
          )}
        </div>
        
        {timestamp && (
          <div className="mt-3 text-xs text-muted-foreground">
            Updated: {new Date(timestamp).toLocaleDateString()}
          </div>
        )}
      </CardContent>
    </Card>
  );
};