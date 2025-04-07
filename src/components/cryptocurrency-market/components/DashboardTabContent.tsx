
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { CryptocurrencyData } from "@/types/market";
import { Payload } from "recharts/types/component/DefaultLegendContent";
import CryptoMarketChart from "./CryptoMarketChart";
import CryptoTable from "./CryptoTable";

interface DashboardTabContentProps {
  activeTab: string;
  data: CryptocurrencyData[];
  selectedMetrics: string[];
  onLegendClick: (data: Payload) => void;
  timeRange: string;
  sortField: string;
  sortDirection: "asc" | "desc";
}

const DashboardTabContent: React.FC<DashboardTabContentProps> = ({
  activeTab,
  data,
  selectedMetrics,
  onLegendClick,
  timeRange,
  sortField,
  sortDirection
}) => {
  if (activeTab === "overview") {
    return (
      <div className="space-y-6">
        {/* Main Chart */}
        <CryptoMarketChart 
          data={data}
          selectedMetrics={selectedMetrics}
          onLegendClick={onLegendClick}
          timeRange={timeRange}
        />
        
        {/* Cryptocurrency Table */}
        <CryptoTable 
          data={data}
          sortField={sortField}
          sortDirection={sortDirection}
        />
      </div>
    );
  }
  
  if (activeTab === "charts") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Advanced Charts</CardTitle>
          <CardDescription>
            Interactive charts and technical analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center p-10">
            <p className="text-muted-foreground">Advanced charts coming soon</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Markets tab
  return (
    <Card>
      <CardHeader>
        <CardTitle>Markets & Exchanges</CardTitle>
        <CardDescription>
          Trading pairs and exchange information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center p-10">
          <p className="text-muted-foreground">Market details coming soon</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardTabContent;
