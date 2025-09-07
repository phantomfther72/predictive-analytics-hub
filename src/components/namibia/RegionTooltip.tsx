import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, MapPin, Users, TrendingUp, DollarSign, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface RegionTooltipProps {
  region: any;
  dataType: 'growth' | 'risk' | 'investment';
  viewMode: 'absolute' | 'percapita';
  onClose: () => void;
}

export const RegionTooltip: React.FC<RegionTooltipProps> = ({
  region,
  dataType,
  viewMode,
  onClose
}) => {
  const formatValue = (value: number) => {
    if (!region.hasData) return 'No data';
    
    switch (dataType) {
      case 'growth':
        return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
      case 'risk':
        const riskLevels = ['Low', 'Medium', 'High'];
        return riskLevels[Math.min(Math.floor(value) - 1, 2)] || 'Unknown';
      case 'investment':
        if (viewMode === 'percapita') {
          return `N$${(value * 1000).toLocaleString()} per 100k`;
        }
        return `N$${value.toLocaleString()}`;
      default:
        return value.toFixed(1);
    }
  };

  const getRiskBadgeColor = (value: number) => {
    if (value <= 1.5) return 'bg-green-500 text-white';
    if (value <= 2.5) return 'bg-yellow-500 text-white';
    return 'bg-red-500 text-white';
  };

  return (
    <Card className="absolute top-4 right-4 w-80 bg-card/95 backdrop-blur-sm border-border shadow-lg z-50">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-base">{region.name}</h3>
            <p className="text-xs text-muted-foreground">{region.capital}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-3">
          {/* Main metric display */}
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {dataType === 'growth' && 'Growth Rate'}
                {dataType === 'risk' && 'Risk Level'}
                {dataType === 'investment' && (viewMode === 'percapita' ? 'Investment per Capita' : 'Investment Volume')}
              </span>
              {dataType === 'growth' && <TrendingUp className="h-4 w-4 text-muted-foreground" />}
              {dataType === 'risk' && <AlertTriangle className="h-4 w-4 text-muted-foreground" />}
              {dataType === 'investment' && <DollarSign className="h-4 w-4 text-muted-foreground" />}
            </div>
            <div className={cn(
              "text-xl font-bold mt-1",
              dataType === 'growth' && region.value >= 10 && "text-green-500",
              dataType === 'growth' && region.value < 5 && "text-red-500",
              dataType === 'risk' && region.value <= 1.5 && "text-green-500",
              dataType === 'risk' && region.value >= 2.5 && "text-red-500"
            )}>
              {formatValue(region.value)}
            </div>
          </div>

          {/* Region details */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <div className="flex items-center gap-1 text-muted-foreground mb-1">
                <Users className="h-3 w-3" />
                <span className="text-xs">Population</span>
              </div>
              <div className="font-medium">{region.population.toLocaleString()}</div>
            </div>
            <div>
              <div className="flex items-center gap-1 text-muted-foreground mb-1">
                <MapPin className="h-3 w-3" />
                <span className="text-xs">Area</span>
              </div>
              <div className="font-medium">{region.area.toLocaleString()} km²</div>
            </div>
          </div>

          {/* Additional info if raw data exists */}
          {region.rawData && (
            <div className="pt-3 border-t border-border">
              <div className="text-xs text-muted-foreground mb-2">Additional Metrics</div>
              <div className="space-y-1">
                {Object.entries(region.rawData)
                  .filter(([key]) => !['region', 'growth_rate', 'risk_score', 'investment'].includes(key))
                  .slice(0, 3)
                  .map(([key, value]: [string, any]) => (
                    <div key={key} className="flex justify-between text-xs">
                      <span className="text-muted-foreground capitalize">
                        {key.replace(/_/g, ' ')}
                      </span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Data status */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <span className="text-xs text-muted-foreground">
              Data Status
            </span>
            <Badge 
              variant={region.hasData ? "default" : "secondary"}
              className={cn(
                "text-xs",
                region.hasData ? "bg-green-500/10 text-green-500 border-green-500/20" : ""
              )}
            >
              {region.hasData ? 'Available' : 'No Data'}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};