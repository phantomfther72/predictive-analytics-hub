
import React from "react";
import { HousingMarketHeader } from "@/components/housing-market/HousingMarketHeader";
import { HousingMarketDashboard } from "@/components/housing-market/HousingMarketDashboard";
import HousingMarketTables from "@/components/housing-market/HousingMarketTables";
import HousingMarketCharts from "@/components/housing-market/HousingMarketCharts";
import HousingMarketPredictions from "@/components/housing-market/HousingMarketPredictions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const HousingMarket: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <HousingMarketHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <HousingMarketDashboard />
        
        <div className="mt-12">
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
    </div>
  );
};

export default HousingMarket;
