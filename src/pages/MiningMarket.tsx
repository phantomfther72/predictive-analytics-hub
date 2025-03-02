
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useMiningSectorData } from "@/components/dashboard/tables/useMiningSectorData";
import { MiningMarketDashboard } from "@/components/mining-market/MiningMarketDashboard";

const MiningMarket: React.FC = () => {
  const { data: miningData, isLoading } = useMiningSectorData();

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold mb-6">Namibian Mining Sector Dashboard</h1>
      
      {isLoading ? (
        <Skeleton className="h-[250px] w-full" />
      ) : (
        <MiningMarketDashboard data={miningData || []} />
      )}
    </div>
  );
};

export default MiningMarket;
