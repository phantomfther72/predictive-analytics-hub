
import React from "react";
import { HousingMarketHeader } from "@/components/housing-market/HousingMarketHeader";
import { HousingMarketDashboard } from "@/components/housing-market/HousingMarketDashboard";
import { HousingMarketTables } from "@/components/housing-market/HousingMarketTables";
import { HousingMarketCharts } from "@/components/housing-market/HousingMarketCharts";
import { HousingMarketPredictions } from "@/components/housing-market/HousingMarketPredictions";

export default function HousingMarket() {
  return (
    <div className="container mx-auto px-4 py-8">
      <HousingMarketHeader />
      <HousingMarketDashboard />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <HousingMarketCharts />
        <HousingMarketPredictions />
      </div>
      <HousingMarketTables />
    </div>
  );
}
