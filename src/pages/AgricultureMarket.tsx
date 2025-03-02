
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAgricultureMarketData } from "@/components/dashboard/tables/useAgricultureMarketData";
import { AgricultureMarketDashboard } from "@/components/agriculture-market/AgricultureMarketDashboard";

const AgricultureMarket: React.FC = () => {
  const { data: agricultureData, isLoading } = useAgricultureMarketData();

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold mb-6">Namibian Agriculture Market Dashboard</h1>
      
      {isLoading ? (
        <Skeleton className="h-[250px] w-full" />
      ) : (
        <AgricultureMarketDashboard data={agricultureData || []} />
      )}
    </div>
  );
};

export default AgricultureMarket;
