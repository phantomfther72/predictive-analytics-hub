
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useGreenHydrogenData } from "@/components/dashboard/tables/useGreenHydrogenData";
import { GreenHydrogenMarketDashboard } from "@/components/green-hydrogen-market/GreenHydrogenMarketDashboard";

const GreenHydrogenMarket: React.FC = () => {
  const { data: hydrogenData, isLoading } = useGreenHydrogenData();

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold mb-6">Namibian Green Hydrogen Market Dashboard</h1>
      
      {isLoading ? (
        <Skeleton className="h-[250px] w-full" />
      ) : (
        <GreenHydrogenMarketDashboard data={hydrogenData || []} />
      )}
    </div>
  );
};

export default GreenHydrogenMarket;
