import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp } from 'lucide-react';
import { Industry } from '@/hooks/usePredictiveData';

interface IndustryCardProps {
  industry: Industry & {
    growth: number;
    risk: string;
    dataCount: number;
  };
  onClick?: () => void;
  className?: string;
}

export const IndustryCard: React.FC<IndustryCardProps> = ({ 
  industry, 
  onClick,
  className 
}) => {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <Card 
      className={`bg-card/50 border backdrop-blur-sm hover:bg-card/70 transition-all duration-300 cursor-pointer ${className}`}
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{industry.icon}</div>
            <div>
              <CardTitle className="text-foreground">{industry.name}</CardTitle>
              <CardDescription>{industry.dataCount} active metrics</CardDescription>
            </div>
          </div>
          <Badge className={getRiskColor(industry.risk)}>
            {industry.risk.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-green-400" />
            <span className="text-green-400 font-bold">
              {industry.growth > 0 ? '+' : ''}{industry.growth.toFixed(1)}%
            </span>
          </div>
          <div className="text-xs text-muted-foreground">12M Forecast</div>
        </div>
      </CardContent>
    </Card>
  );
};