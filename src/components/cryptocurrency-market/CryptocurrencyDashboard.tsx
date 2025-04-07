
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CryptocurrencyData } from "@/types/market";
import { Payload } from "recharts/types/component/DefaultLegendContent";
import { 
  MarketOverview, 
  FilterControls, 
  DashboardTabContent 
} from "./components";

interface CryptocurrencyDashboardProps {
  data: CryptocurrencyData[];
}

export const CryptocurrencyDashboard: React.FC<CryptocurrencyDashboardProps> = ({ 
  data 
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<string>("market_cap_usd");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(["current_price_usd", "market_cap_usd", "price_change_percentage_24h"]);
  const [timeRange, setTimeRange] = useState<string>("24h");
  const [activeTab, setActiveTab] = useState<string>("overview");

  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const toggleMetric = (metric: string) => {
    setSelectedMetrics(prev => 
      prev.includes(metric) 
        ? prev.filter(m => m !== metric) 
        : [...prev, metric]
    );
  };

  const handleLegendClick = (data: Payload) => {
    if (data && data.dataKey) {
      toggleMetric(String(data.dataKey));
    }
  };

  // Filter and sort data
  const filteredData = data
    .filter(crypto => 
      crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const fieldA = a[sortField as keyof CryptocurrencyData];
      const fieldB = b[sortField as keyof CryptocurrencyData];
      
      if (typeof fieldA === 'number' && typeof fieldB === 'number') {
        return sortDirection === 'asc' ? fieldA - fieldB : fieldB - fieldA;
      }
      
      // Default sort for non-numeric fields
      return sortDirection === 'asc' 
        ? String(fieldA).localeCompare(String(fieldB))
        : String(fieldB).localeCompare(String(fieldA));
    });

  return (
    <div className="space-y-6">
      {/* Market Overview Stats */}
      <MarketOverview data={data} />

      {/* Filter Controls */}
      <FilterControls 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortField={sortField}
        setSortField={setSortField}
        sortDirection={sortDirection}
        toggleSortDirection={toggleSortDirection}
        timeRange={timeRange}
        setTimeRange={setTimeRange}
      />

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="charts">Charts</TabsTrigger>
          <TabsTrigger value="markets">Markets</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab}>
          <DashboardTabContent 
            activeTab={activeTab}
            data={filteredData}
            selectedMetrics={selectedMetrics}
            onLegendClick={handleLegendClick}
            timeRange={timeRange}
            sortField={sortField}
            sortDirection={sortDirection}
          />
        </TabsContent>
      </Tabs>
      
      <style>
        {`
        .price-change-bar[data-value-positive="true"] {
          fill: #10B981;
        }
        .price-change-bar[data-value-positive="false"] {
          fill: #EF4444;
        }
        `}
      </style>
    </div>
  );
};
