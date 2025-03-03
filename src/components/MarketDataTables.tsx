
import React from "react";
import { useMarketMetrics } from "@/hooks/useMarketMetrics";
import { groupMetricsByMarketType } from "@/utils/marketMetricsUtils";
import MarketDataSkeleton from "./market-data/MarketDataSkeleton";
import MarketDataGrid from "./market-data/MarketDataGrid";
import MarketAlerts from "./market-data/MarketAlerts";

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
      <div>
        <h2 className="text-3xl font-bold mb-6">Latest Market Insights</h2>
        <MarketDataGrid groupedMetrics={groupedMetrics} />
      </div>

      {/* Real-time alerts section */}
      {marketMetrics && marketMetrics.length > 0 && (
        <MarketAlerts metrics={marketMetrics} />
      )}
    </div>
  );
};

export default MarketDataTables;
