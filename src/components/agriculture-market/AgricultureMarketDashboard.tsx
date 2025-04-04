
import React, { useState } from "react";
import { AgricultureMarketData } from "@/types/market";
import { Button } from "@/components/ui/button";
import { ChevronRight, LineChart as ChartIconLine } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AgricultureFilterBar } from "./components/AgricultureFilterBar";
import { AgricultureKeyMetrics } from "./components/AgricultureKeyMetrics";
import { AgricultureCharts } from "./components/AgricultureCharts";
import { CropPerformanceTable } from "./components/CropPerformanceTable";
import { ClimateAnalysis } from "./components/ClimateAnalysis";
import { FertilizerAnalysis } from "./components/FertilizerAnalysis";
import { formatDate } from "./utils/formatter";

interface AgricultureMarketDashboardProps {
  data?: AgricultureMarketData[];
}

export const AgricultureMarketDashboard: React.FC<AgricultureMarketDashboardProps> = ({ data = [] }) => {
  const navigate = useNavigate();
  const [selectedTimeframe, setSelectedTimeframe] = useState<"1M" | "3M" | "6M" | "1Y" | "ALL">("6M");
  const [selectedCropType, setSelectedCropType] = useState<string>("All Crops");
  const [selectedRegion, setSelectedRegion] = useState<string>("All Regions");
  
  if (!data || data.length === 0) {
    return <p>No agriculture market data available.</p>;
  }

  // Get latest data
  const latestData = data[0];
  
  // Extract unique crop types from data
  const cropTypes = React.useMemo(() => {
    const types = Array.from(new Set(data.map(item => item.crop_type)));
    return ["All Crops", ...types];
  }, [data]);
  
  // Extract unique regions from data
  const regions = React.useMemo(() => {
    const uniqueRegions = Array.from(new Set(data.map(item => item.region)));
    return ["All Regions", ...uniqueRegions];
  }, [data]);
  
  // Filter data based on selected timeframe, crop type, and region
  const filteredData = React.useMemo(() => {
    let filtered = [...data];
    
    // Filter by timeframe
    if (selectedTimeframe !== "ALL") {
      const now = new Date();
      let cutoffDate = new Date();
      
      switch (selectedTimeframe) {
        case "1M":
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        case "3M":
          cutoffDate.setMonth(now.getMonth() - 3);
          break;
        case "6M":
          cutoffDate.setMonth(now.getMonth() - 6);
          break;
        case "1Y":
          cutoffDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      filtered = filtered.filter(item => new Date(item.timestamp) >= cutoffDate);
    }
    
    // Filter by crop type
    if (selectedCropType !== "All Crops") {
      filtered = filtered.filter(item => item.crop_type === selectedCropType);
    }
    
    // Filter by region
    if (selectedRegion !== "All Regions") {
      filtered = filtered.filter(item => item.region === selectedRegion);
    }
    
    return filtered;
  }, [data, selectedTimeframe, selectedCropType, selectedRegion]);
  
  // Process market price data for charts
  const priceChartData = React.useMemo(() => {
    return filteredData
      .map(item => ({
        timestamp: item.timestamp,
        price: item.market_price_usd,
        crop: item.crop_type,
        region: item.region,
        predicted: item.market_price_usd * (1 + (item.predicted_change || 0) / 100)
      }))
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [filteredData]);
  
  // Process yield data for charts
  const yieldChartData = React.useMemo(() => {
    return filteredData
      .map(item => ({
        timestamp: item.timestamp,
        yield: item.yield_per_hectare,
        crop: item.crop_type,
        region: item.region
      }))
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [filteredData]);
  
  // Process rainfall data for charts
  const rainfallChartData = React.useMemo(() => {
    return filteredData
      .map(item => ({
        timestamp: item.timestamp,
        rainfall: item.rainfall_mm,
        irrigation: item.irrigation_volume_m3 / 1000, // Convert to m³ in thousands
        region: item.region
      }))
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [filteredData]);
  
  // Process export/import data for charts
  const tradeChartData = React.useMemo(() => {
    return filteredData
      .map(item => ({
        timestamp: item.timestamp,
        export: item.export_volume_tons,
        import: item.import_volume_tons,
        balance: item.export_volume_tons - item.import_volume_tons,
        crop: item.crop_type
      }))
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [filteredData]);
  
  // Calculate crop performance metrics
  const cropPerformance = React.useMemo(() => {
    const cropMap = new Map<string, any>();
    
    cropTypes.forEach(crop => {
      if (crop !== "All Crops") {
        const cropData = data.filter(item => item.crop_type === crop);
        
        if (cropData.length > 0) {
          const latestCropData = cropData[0];
          const avgYield = cropData.reduce((sum, item) => sum + item.yield_per_hectare, 0) / cropData.length;
          const avgPrice = cropData.reduce((sum, item) => sum + item.market_price_usd, 0) / cropData.length;
          
          cropMap.set(crop, {
            crop,
            avgYield,
            avgPrice,
            totalExport: latestCropData.export_volume_tons,
            predictedChange: latestCropData.predicted_change,
            predictionConfidence: latestCropData.prediction_confidence,
            revenuePerHectare: avgYield * avgPrice
          });
        }
      }
    });
    
    return Array.from(cropMap.values());
  }, [data, cropTypes]);
  
  // Calculate season and climate metrics
  const climateMetrics = React.useMemo(() => {
    const totalRainfall = filteredData.reduce((sum, item) => sum + item.rainfall_mm, 0);
    const avgRainfall = totalRainfall / (filteredData.length || 1);
    const avgIrrigation = filteredData.reduce((sum, item) => sum + item.irrigation_volume_m3, 0) / (filteredData.length || 1);
    const rainfallDev = Math.abs(avgRainfall - 75) / 75 * 100; // Deviation from ideal 75mm
    
    return {
      totalRainfall,
      avgRainfall,
      avgIrrigation,
      rainfallDev,
      droughtRisk: rainfallDev > 30 ? "High" : rainfallDev > 15 ? "Moderate" : "Low",
      predictedRainfall: avgRainfall * 0.92, // 8% reduction prediction
      waterEfficiency: filteredData.reduce((sum, item) => sum + (item.yield_per_hectare / (item.irrigation_volume_m3 / 10000)), 0) / (filteredData.length || 1)
    };
  }, [filteredData]);
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Namibian Agriculture Market</h2>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={() => navigate("/dashboard/charts")}
        >
          <ChartIconLine size={16} />
          <span>Interactive Charts</span>
          <ChevronRight size={16} />
        </Button>
      </div>

      {/* Filters Row */}
      <AgricultureFilterBar
        selectedTimeframe={selectedTimeframe}
        setSelectedTimeframe={setSelectedTimeframe}
        selectedCropType={selectedCropType}
        setSelectedCropType={setSelectedCropType}
        selectedRegion={selectedRegion}
        setSelectedRegion={setSelectedRegion}
        cropTypes={cropTypes}
        regions={regions}
      />

      {/* Key Performance Indicators */}
      <AgricultureKeyMetrics latestData={latestData} />

      {/* Interactive Charts Section */}
      <AgricultureCharts 
        priceChartData={priceChartData}
        yieldChartData={yieldChartData}
        rainfallChartData={rainfallChartData}
        tradeChartData={tradeChartData}
        formatDate={formatDate}
      />

      {/* Crop Performance Table */}
      <CropPerformanceTable cropPerformance={cropPerformance} />

      {/* Weather and Climate Impact */}
      <ClimateAnalysis climateMetrics={climateMetrics} />

      {/* Fertilizer & Input Analysis */}
      <FertilizerAnalysis />
    </div>
  );
};
