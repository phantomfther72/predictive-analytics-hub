
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useFinancialMarketData } from "@/components/dashboard/tables/useFinancialMarketData";
import { FinancialMarketDashboard } from "@/components/financial-market/FinancialMarketDashboard";

const FinancialMarket: React.FC = () => {
  const { data: financialData, isLoading } = useFinancialMarketData();

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold mb-6">Namibian Financial Market Dashboard</h1>
      
      {isLoading ? (
        <Skeleton className="h-[250px] w-full" />
      ) : (
        <FinancialMarketDashboard data={financialData || []} />
      )}
    </div>
  );
};

export default FinancialMarket;
