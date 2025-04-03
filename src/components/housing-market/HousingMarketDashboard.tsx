
import React from "react";
import { HousingMarketData } from "@/types/market";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HousingMarketCharts from "./HousingMarketCharts";
import { HousingMarketOverview } from "./HousingMarketOverview";
import { HousingMarketAnalysis } from "./HousingMarketAnalysis";

interface HousingMarketDashboardProps {
  data: HousingMarketData[];
}

export const HousingMarketDashboard: React.FC<HousingMarketDashboardProps> = ({ data }) => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="charts">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="charts">Charts</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-6">
          <HousingMarketOverview data={data} />
        </TabsContent>
        <TabsContent value="charts" className="mt-6">
          <HousingMarketCharts />
        </TabsContent>
        <TabsContent value="analysis" className="mt-6">
          <HousingMarketAnalysis data={data} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
