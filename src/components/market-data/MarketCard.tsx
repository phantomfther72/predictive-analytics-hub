
import React from "react";
import { Badge } from "@/components/ui/badge";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from "@/components/ui/card";
import { MarketMetric } from "@/types/market";

interface MarketCardProps {
  marketType: string;
  metrics: MarketMetric[];
  onCardClick?: () => void;
  isClickable?: boolean;
}

const MarketCard: React.FC<MarketCardProps> = ({ 
  marketType, 
  metrics, 
  onCardClick,
  isClickable = false
}) => {
  return (
    <Card 
      className={`hover:shadow-lg transition-shadow ${
        isClickable ? 'cursor-pointer border-blue-200 hover:border-blue-400' : ''
      }`}
      onClick={isClickable ? onCardClick : undefined}
    >
      <CardHeader>
        <CardTitle className="capitalize flex items-center justify-between">
          <span>{marketType.replace('_', ' ')} Market</span>
          {isClickable && (
            <Badge variant="outline" className="text-xs text-blue-600 border-blue-300 ml-2">
              Detailed View
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Latest metrics and predictions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {metrics.map((metric) => (
            <div
              key={metric.id}
              className="border-b border-gray-100 last:border-0 pb-3 last:pb-0"
            >
              <p className="text-sm font-medium text-gray-600">
                {metric.metric_name}
              </p>
              <div className="flex justify-between items-baseline mt-1">
                <p className="text-2xl font-bold">
                  {typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}
                </p>
                <span className="text-sm text-gray-500">
                  {metric.source}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Updated: {new Date(metric.timestamp).toLocaleDateString()}
              </p>
              {metric.predicted_change !== undefined && metric.prediction_confidence !== undefined && (
                <div className="mt-2">
                  <p className={`text-xs font-medium ${Number(metric.predicted_change) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    Predicted change: {Number(metric.predicted_change) > 0 ? '+' : ''}{metric.predicted_change}%
                    <span className="text-gray-500 ml-1">
                      (Confidence: {Math.round((metric.prediction_confidence || 0) * 100)}%)
                    </span>
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketCard;
