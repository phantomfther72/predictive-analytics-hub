
import React from "react";
import { useMarketMetrics } from "@/hooks/useMarketMetrics";
import { groupMetricsByMarketType } from "@/utils/marketMetricsUtils";
import MarketDataSkeleton from "./market-data/MarketDataSkeleton";
import MarketDataGrid from "./market-data/MarketDataGrid";
import DynamicMarketAlerts from "./market-data/DynamicMarketAlerts";
import { MarketInsightsCarousel } from "./ui/market-insights";

const MarketDataTables: React.FC = () => {
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="lg:col-span-2">
          <h2 className="text-3xl font-bold mb-6">Latest Market Insights</h2>
          <MarketInsightsCarousel 
            autoplayInterval={7000}
            className="max-w-5xl mx-auto"
          />
        </div>
        
        <MarketDataGrid groupedMetrics={groupedMetrics} />
        
        {marketMetrics && marketMetrics.length > 0 && (
          <DynamicMarketAlerts 
            metrics={marketMetrics} 
            autoplayInterval={5000}
          />
        )}
      </div>
    </div>
  );
};

export default MarketDataTables;
