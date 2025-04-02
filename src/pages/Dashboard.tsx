
import React, { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { LiveMetricTicker } from "@/components/ui/live-metric-ticker";
import { Toaster } from "@/components/ui/toaster";
import { supabase } from "@/integrations/supabase/client";
import { useChartState } from "@/components/dashboard/charts/use-chart-state";
import { calculateWeightedPrediction } from "@/components/dashboard/charts/utils/model-utils";

const Dashboard = () => {
  const isMobile = useIsMobile();
  const { models } = useChartState();
  const [liveMetrics, setLiveMetrics] = useState([
    { name: "S&P 500", value: "4,783.45", change: "+0.84%", isPositive: true },
    { name: "NASDAQ", value: "16,248.52", change: "+1.12%", isPositive: true },
    { name: "DOW JONES", value: "37,735.04", change: "+0.61%", isPositive: true },
    { name: "GOLD", value: "2,383.90", change: "+0.82%", isPositive: true },
    { name: "OIL", value: "76.05", change: "-1.25%", isPositive: false },
    { name: "EURO/USD", value: "1.0892", change: "-0.25%", isPositive: false },
    { name: "BTC/USD", value: "62,348.15", change: "+2.45%", isPositive: true },
    { name: "NAM HOUSING", value: "845,300", change: "+3.5%", isPositive: true },
  ]);

  // Fetch live metrics from Supabase
  useEffect(() => {
    const fetchLiveMetrics = async () => {
      try {
        const { data, error } = await supabase
          .from('financial_market_metrics')
          .select(`
            asset,
            current_price,
            change_percentage_24h,
            predicted_change,
            prediction_confidence
          `)
          .order('timestamp', { ascending: false })
          .limit(8);
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          // Transform data for the ticker
          const updatedMetrics = data.map(item => {
            // Create a simple model predictions object for this asset
            const modelPredictions = {};
            
            // For demo purposes, distribute the predicted change across models with some variance
            if (item.predicted_change) {
              models.forEach((model, index) => {
                const variance = (index - 1) * 0.5; // Add some variance between models
                modelPredictions[model.id] = item.predicted_change + variance;
              });
              
              // Calculate the weighted prediction
              const weightedPrediction = calculateWeightedPrediction(modelPredictions, models);
              
              return {
                name: item.asset,
                value: item.current_price.toLocaleString(),
                change: `${item.change_percentage_24h >= 0 ? '+' : ''}${item.change_percentage_24h.toFixed(2)}%`,
                isPositive: item.change_percentage_24h >= 0,
                prediction: `${weightedPrediction >= 0 ? '+' : ''}${weightedPrediction.toFixed(2)}%`,
                hasPrediction: true,
                confidenceScore: item.prediction_confidence
              };
            }
            
            return {
              name: item.asset,
              value: item.current_price.toLocaleString(),
              change: `${item.change_percentage_24h >= 0 ? '+' : ''}${item.change_percentage_24h.toFixed(2)}%`,
              isPositive: item.change_percentage_24h >= 0
            };
          });
          
          setLiveMetrics(updatedMetrics);
        }
      } catch (error) {
        console.error("Error fetching live metrics:", error);
      }
    };
    
    // Initial fetch
    fetchLiveMetrics();
    
    // Set up refresh interval
    const interval = setInterval(fetchLiveMetrics, 60000); // Refresh every minute
    
    // Set up real-time subscription
    const channel = supabase
      .channel('financial-metrics-changes')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'financial_market_metrics' 
      }, () => {
        fetchLiveMetrics();
      })
      .subscribe();
      
    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, [models]);

  return (
    <DndContext collisionDetection={closestCenter}>
      <SidebarProvider>
        <div className="min-h-screen flex flex-col w-full bg-slate-50 dark:bg-slate-900">
          <DashboardHeader />
          <div className="px-3 py-2 sm:px-4 sm:py-3">
            <LiveMetricTicker metrics={liveMetrics} />
          </div>
          <div className="flex flex-1 flex-col md:flex-row min-w-0">
            <DashboardSidebar />
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
              <div className={cn(
                "flex-1 py-3 sm:py-4 md:py-6 mobile-transition",
                isMobile ? "px-3 sm:px-4" : "container"
              )}>
                <DashboardContent />
              </div>
            </main>
          </div>
          <Toaster />
        </div>
      </SidebarProvider>
    </DndContext>
  );
};

export default Dashboard;
