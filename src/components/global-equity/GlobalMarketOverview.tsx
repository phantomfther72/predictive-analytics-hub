
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, TrendingDown, DollarSign, BarChart3 } from "lucide-react";
import { GlobalEquityData, MarketRegion, AssetClass } from "@/types/global-equity";

interface GlobalMarketOverviewProps {
  data: GlobalEquityData[];
  selectedRegion: MarketRegion | 'all';
  selectedAssetClass: AssetClass | 'all';
  onRegionChange: (region: MarketRegion | 'all') => void;
  onAssetClassChange: (assetClass: AssetClass | 'all') => void;
}

export const GlobalMarketOverview: React.FC<GlobalMarketOverviewProps> = ({
  data,
  selectedRegion,
  selectedAssetClass,
  onRegionChange,
  onAssetClassChange,
}) => {
  const filteredData = data.filter(item => {
    const regionMatch = selectedRegion === 'all' || item.region === selectedRegion;
    const assetMatch = selectedAssetClass === 'all' || item.asset_class === selectedAssetClass;
    return regionMatch && assetMatch;
  });

  const getChangeIcon = (change: number) => {
    return change >= 0 ? (
      <TrendingUp className="h-4 w-4 text-green-500" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-500" />
    );
  };

  const formatCurrency = (value: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatLargeNumber = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(1)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    return `$${value.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-4">
          <Select value={selectedRegion} onValueChange={onRegionChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              <SelectItem value="developed">Developed Markets</SelectItem>
              <SelectItem value="emerging">Emerging Markets</SelectItem>
              <SelectItem value="frontier">Frontier Markets</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedAssetClass} onValueChange={onAssetClassChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Asset Class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Assets</SelectItem>
              <SelectItem value="equity">Equities</SelectItem>
              <SelectItem value="commodity">Commodities</SelectItem>
              <SelectItem value="real_estate">Real Estate</SelectItem>
              <SelectItem value="fixed_income">Fixed Income</SelectItem>
              <SelectItem value="crypto">Cryptocurrency</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button variant="outline" className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          Export Data
        </Button>
      </div>

      {/* Market Data Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredData.map((asset) => (
          <Card key={asset.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{asset.symbol}</CardTitle>
                  <CardDescription className="text-sm">{asset.name}</CardDescription>
                </div>
                <Badge variant={asset.region === 'developed' ? 'default' : 'secondary'}>
                  {asset.region}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Price and Change */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">
                    {formatCurrency(asset.current_price, asset.currency)}
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    {getChangeIcon(asset.change_percentage_24h)}
                    <span className={asset.change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {asset.change_percentage_24h >= 0 ? '+' : ''}
                      {asset.change_percentage_24h.toFixed(2)}%
                    </span>
                  </div>
                </div>
                
                {asset.market_cap && (
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Market Cap</div>
                    <div className="font-semibold">{formatLargeNumber(asset.market_cap)}</div>
                  </div>
                )}
              </div>

              {/* AI Prediction */}
              {asset.predicted_change && (
                <div className="bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-950 dark:to-teal-950 p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">AI Prediction</span>
                    <Badge variant="outline" className="text-xs">
                      {(asset.prediction_confidence * 100).toFixed(0)}% confidence
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    {getChangeIcon(asset.predicted_change)}
                    <span className={`font-semibold ${asset.predicted_change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {asset.predicted_change >= 0 ? '+' : ''}
                      {asset.predicted_change.toFixed(1)}%
                    </span>
                    <span className="text-xs text-muted-foreground">7-day forecast</span>
                  </div>
                  {asset.prediction_explanation && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {asset.prediction_explanation}
                    </p>
                  )}
                </div>
              )}

              {/* Additional Info */}
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Volume: {(asset.volume_24h / 1e6).toFixed(1)}M</span>
                <span>{asset.exchange}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredData.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">
              No assets found for the selected filters. Try adjusting your criteria.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
