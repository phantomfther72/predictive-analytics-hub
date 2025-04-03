
import React from "react";
import { FinancialMarketMetric } from "@/types/market";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FinancialMarketCharts from "./FinancialMarketCharts";
import { FinancialMarketOverview } from "./FinancialMarketOverview";
import { FinancialMarketAnalysis } from "./FinancialMarketAnalysis";

interface FinancialMarketDashboardProps {
  data: FinancialMarketMetric[];
}

export const FinancialMarketDashboard: React.FC<FinancialMarketDashboardProps> = ({ data }) => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="charts">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="charts">Charts</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-6">
          <FinancialMarketOverview data={data} />
        </TabsContent>
        <TabsContent value="charts" className="mt-6">
          <FinancialMarketCharts />
        </TabsContent>
        <TabsContent value="analysis" className="mt-6">
          <FinancialMarketAnalysis data={data} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
