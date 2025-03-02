
import React from "react";
import { HousingMarketHeader } from "@/components/housing-market/HousingMarketHeader";
import { HousingMarketDashboard } from "@/components/housing-market/HousingMarketDashboard";
import HousingMarketTables from "@/components/housing-market/HousingMarketTables";
import HousingMarketCharts from "@/components/housing-market/HousingMarketCharts";
import HousingMarketPredictions from "@/components/housing-market/HousingMarketPredictions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const HousingMarket: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Housing Market Dashboard</h1>
        <p className="text-muted-foreground">
          Comprehensive analysis and predictions for the housing market
        </p>
      </div>
      
      <HousingMarketDashboard />
      
      <div className="mt-8">
        <Tabs defaultValue="data-tables" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="data-tables">Market Data Tables</TabsTrigger>
            <TabsTrigger value="interactive-charts">Interactive Charts</TabsTrigger>
            <TabsTrigger value="predictions">Predictive Analysis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="data-tables">
            <HousingMarketTables />
          </TabsContent>
          
          <TabsContent value="interactive-charts">
            <HousingMarketCharts />
          </TabsContent>
          
          <TabsContent value="predictions">
            <HousingMarketPredictions />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default HousingMarket;
