
import React from "react";
import { useMarketMetrics } from "@/hooks/useMarketMetrics";
import { groupMetricsByMarketType } from "@/utils/marketMetricsUtils";
import MarketDataSkeleton from "./market-data/MarketDataSkeleton";
import MarketDataGrid from "./market-data/MarketDataGrid";
import DynamicMarketAlerts from "./market-data/DynamicMarketAlerts";
import { MarketInsightsCarousel } from "./ui/market-insights";
import { MarketInsight } from "./ui/market-insights/types";

interface MarketDataTablesProps {
  onInsightClick?: (insight: MarketInsight) => void;
}

const MarketDataTables: React.FC<MarketDataTablesProps> = ({ onInsightClick }) => {
  const { data: marketMetrics, isLoading } = useMarketMetrics();
  
  const groupedMetrics = React.useMemo(() => 
    groupMetricsByMarketType(marketMetrics), 
    [marketMetrics]
  );

  if (isLoading) {
    return <MarketDataSkeleton />;
  }

  return (
    <div className="space-y-12 py-8">
      <div className="grid grid-cols-1 gap-6">
        <div>
          <h2 className="text-3xl font-bold mb-6">Latest Market Insights</h2>
          <div className="max-w-5xl mx-auto">
            <MarketInsightsCarousel 
              autoplayInterval={7000}
              className="w-full"
              onInsightClick={onInsightClick}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <MarketDataGrid groupedMetrics={groupedMetrics} />
          
          {marketMetrics && marketMetrics.length > 0 && (
            <DynamicMarketAlerts 
              metrics={marketMetrics} 
              autoplayInterval={5000}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketDataTables;
