
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useHousingMarketData } from "@/components/dashboard/tables/useHousingMarketData";
import { HousingMarketDashboard } from "@/components/housing-market/HousingMarketDashboard";

const HousingMarket: React.FC = () => {
  const { data: housingData, isLoading } = useHousingMarketData();

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold mb-6">Namibian Housing Market Dashboard</h1>
      
      {isLoading ? (
        <Skeleton className="h-[250px] w-full" />
      ) : (
        <HousingMarketDashboard data={housingData || []} />
      )}
    </div>
  );
};

export default HousingMarket;
