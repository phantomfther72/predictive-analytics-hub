
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
import MetricItem from "./MetricItem";

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
  const formattedMarketTitle = marketType.replace('_', ' ');

  return (
    <Card 
      className={`hover:shadow-lg transition-shadow ${
        isClickable ? 'cursor-pointer border-blue-200 hover:border-blue-400' : ''
      }`}
      onClick={isClickable ? onCardClick : undefined}
    >
      <CardHeader>
        <CardTitle className="capitalize flex items-center justify-between">
          <span>{formattedMarketTitle} Market</span>
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
            <MetricItem key={metric.id} metric={metric} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketCard;
