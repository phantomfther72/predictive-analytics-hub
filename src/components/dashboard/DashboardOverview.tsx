import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { NewsFeed } from "./NewsFeed";
import { useMarketData } from "./tables/useMarketData";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LineChart, BarChart3, PieChart, TrendingUp, TrendingDown, RefreshCw, Eye, Zap, Activity, DollarSign, Home, Leaf, Pickaxe, LayoutDashboard, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { LiveDataCard } from "../ui/live-data-card";
import { SparklineChart } from "../charts/SparklineChart";
import { LiveMetricTicker } from "../ui/live-metric-ticker";
import { useDraggableCards } from "@/hooks/use-draggable-cards";
import { useBreakpoint, useIsMobile } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";
import PredictionBadge from "../market-data/PredictionBadge";

export const DashboardOverview = () => {
  const { 
    financialData, 
    housingData, 
    miningData, 
    agricultureData, 
    hydrogenData,
    isLoadingFinancial,
    isLoadingHousing,
    isLoadingMining,
    isLoadingAgriculture,
    isLoadingHydrogen
  } = useMarketData();
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const isSmallScreen = useBreakpoint("md");
  
  const [activeTab, setActiveTab] = useState<string>("all");
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  
  // Setup cards for the drag and drop functionality
  const { items, handleDragEnd, handleReorderCards } = useDraggableCards([
    "financial-overview",
    "housing-overview",
    "mining-overview",
    "agriculture-overview",
    "hydrogen-overview"
  ]);

  useEffect(() => {
    // Subscribe to realtime updates
    const channel = supabase
      .channel('market-updates')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'market_metrics' }, 
        (payload) => {
          console.log('Market metrics updated:', payload);
          setLastUpdated(new Date());
          toast({
            title: "Data Updated",
            description: "Market metrics have been refreshed",
            duration: 3000
          });
        })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Simulate refresh - in a real app this would trigger actual data refetching
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLastUpdated(new Date());
      toast({
        title: "Data Refreshed",
        description: "Latest market data loaded successfully",
      });
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast({
        title: "Refresh Failed",
        description: "Could not refresh market data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const isLoading = 
    isLoadingFinancial || 
    isLoadingHousing || 
    isLoadingMining || 
    isLoadingAgriculture || 
    isLoadingHydrogen;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with refresh controls - improved layout for mobile */}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Market Overview</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {isLoading 
              ? "Loading latest market insights..." 
              : `Last updated: ${lastUpdated.toLocaleTimeString()}`}
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={cn(
              "flex-shrink-0 flex items-center gap-2 touch-target min-w-24 justify-center",
              isRefreshing && "animate-pulse"
            )}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
          </Button>
          
          <Button 
            variant="default" 
            size="sm"
            className="flex-shrink-0 touch-target flex items-center gap-2 min-w-24 justify-center"
            onClick={() => navigate("/dashboard/charts")}
          >
            <LineChart className="h-4 w-4" />
            <span className="hidden xs:inline">Interactive</span>
            <span>Charts</span>
          </Button>
        </div>
      </div>

      {/* Improved mobile-friendly market filter tabs */}
      <div className="overflow-hidden">
        <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange} className="w-full">
          <div className="overflow-x-auto pb-2 -mb-2">
            <TabsList className="w-max min-w-full flex md:justify-center p-1">
              <TabsTrigger value="all" className="touch-target px-4 min-w-16">All Markets</TabsTrigger>
              <TabsTrigger value="financial" className="touch-target px-4 min-w-16">Financial</TabsTrigger>
              <TabsTrigger value="housing" className="touch-target px-4 min-w-16">Housing</TabsTrigger>
              <TabsTrigger value="mining" className="touch-target px-4 min-w-16">Mining</TabsTrigger>
              <TabsTrigger value="agriculture" className="touch-target px-4 min-w-16">Agriculture</TabsTrigger>
              <TabsTrigger value="hydrogen" className="touch-target px-4 min-w-16">Green Hydrogen</TabsTrigger>
            </TabsList>
          </div>
        </Tabs>
      </div>

      {/* Live metrics ticker */}
      <LiveMetricTicker />

      {/* Key market indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <LiveDataCard 
          title="Market Activity"
          value={isLoading ? "Loading..." : "High"}
          delta={12.4}
          icon={Activity}
          trend="up"
          loading={isLoading}
        />
        <LiveDataCard 
          title="Daily Transactions"
          value={isLoading ? "Loading..." : "1.8M"}
          delta={-3.2}
          icon={Zap}
          trend="down"
          loading={isLoading}
        />
        <LiveDataCard 
          title="Market Volatility"
          value={isLoading ? "Loading..." : "Moderate"}
          delta={5.7}
          icon={Activity}
          trend="up"
          loading={isLoading}
        />
        <LiveDataCard 
          title="Prediction Accuracy"
          value={isLoading ? "Loading..." : "94%"}
          delta={1.2}
          icon={Eye}
          trend="up"
          loading={isLoading}
        />
      </div>

      {/* Market Dashboards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {items.map((id) => {
          // Show only cards that match the active tab or when "all" is selected
          if (activeTab !== "all" && !id.includes(activeTab)) {
            return null;
          }

          switch (id) {
            case "financial-overview":
              return (
                <Card key={id} className="overflow-hidden border-blue-100 dark:border-blue-900/40 hover:shadow-md transition-shadow">
                  <CardHeader className="bg-slate-50 dark:bg-slate-800/50 border-b flex flex-row items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      <CardTitle className="text-lg">Financial Markets</CardTitle>
                    </div>
                    <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50 dark:bg-blue-900/20">
                      {isLoadingFinancial ? "Loading..." : "Live"}
                    </Badge>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-slate-500 dark:text-slate-400">S&P 500 Index</p>
                          <div className="flex items-baseline gap-1.5">
                            <p className="text-2xl font-semibold">
                              {isLoadingFinancial ? "..." : "4,783.45"}
                            </p>
                            <Badge className="bg-green-500 hover:bg-green-600">+0.84%</Badge>
                          </div>
                        </div>
                        <div className="w-24 h-12">
                          <SparklineChart 
                            data={[34, 45, 43, 41, 49, 53, 52]}
                            color="#22c55e"
                            showTooltip={true}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Nasdaq</p>
                          <div className="flex items-baseline gap-1.5">
                            <p className="text-lg font-semibold">
                              {isLoadingFinancial ? "..." : "16,248.52"}
                            </p>
                            <span className="text-green-600 text-xs font-medium">+1.12%</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Dow Jones</p>
                          <div className="flex items-baseline gap-1.5">
                            <p className="text-lg font-semibold">
                              {isLoadingFinancial ? "..." : "37,735.04"}
                            </p>
                            <span className="text-green-600 text-xs font-medium">+0.61%</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-2">
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-1.5">Market Prediction</p>
                        <PredictionBadge
                          value={1.8}
                          confidence={0.87}
                          factors={{
                            market_trend: 82,
                            volatility: 45,
                            sentiment: 76
                          }}
                          size="md"
                          showConfidence={true}
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-slate-50 dark:bg-slate-800/50 border-t flex justify-between py-3">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {isLoadingFinancial ? "Loading data..." : "Updated just now"}
                    </p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-auto p-0 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      onClick={() => navigate("/financial-market")}
                    >
                      View Details
                      <ChevronRight className="h-3 w-3 ml-1" />
                    </Button>
                  </CardFooter>
                </Card>
              );
              
            case "housing-overview":
              return (
                <Card key={id} className="overflow-hidden border-emerald-100 dark:border-emerald-900/40 hover:shadow-md transition-shadow">
                  <CardHeader className="bg-slate-50 dark:bg-slate-800/50 border-b flex flex-row items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Home className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      <CardTitle className="text-lg">Housing Market</CardTitle>
                    </div>
                    <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50 dark:bg-emerald-900/20">
                      {isLoadingHousing ? "Loading..." : "Live"}
                    </Badge>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Average Home Price</p>
                          <div className="flex items-baseline gap-1.5">
                            <p className="text-2xl font-semibold">
                              {isLoadingHousing ? "..." : "$452,300"}
                            </p>
                            <Badge className="bg-amber-500 hover:bg-amber-600">+0.3%</Badge>
                          </div>
                        </div>
                        <div className="w-24 h-12">
                          <SparklineChart 
                            data={[55, 56, 58, 57, 59, 58, 60]}
                            color="#f59e0b"
                            showTooltip={true}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Listings</p>
                          <div className="flex items-baseline gap-1.5">
                            <p className="text-lg font-semibold">
                              {isLoadingHousing ? "..." : "3,842"}
                            </p>
                            <span className="text-green-600 text-xs font-medium">+2.4%</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Days on Market</p>
                          <div className="flex items-baseline gap-1.5">
                            <p className="text-lg font-semibold">
                              {isLoadingHousing ? "..." : "32"}
                            </p>
                            <span className="text-red-600 text-xs font-medium">+5 days</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-2">
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-1.5">Market Prediction</p>
                        <PredictionBadge
                          value={0.8}
                          confidence={0.72}
                          factors={{
                            market_trend: 64,
                            volatility: 32,
                            sentiment: 81
                          }}
                          size="md"
                          showConfidence={true}
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-slate-50 dark:bg-slate-800/50 border-t flex justify-between py-3">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {isLoadingHousing ? "Loading data..." : "Updated 5 minutes ago"}
                    </p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-auto p-0 text-sm text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
                      onClick={() => navigate("/housing-market")}
                    >
                      View Details
                      <ChevronRight className="h-3 w-3 ml-1" />
                    </Button>
                  </CardFooter>
                </Card>
              );

            case "mining-overview":
              return (
                <Card key={id} className="overflow-hidden border-orange-100 dark:border-orange-900/40 hover:shadow-md transition-shadow">
                  <CardHeader className="bg-slate-50 dark:bg-slate-800/50 border-b flex flex-row items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Pickaxe className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                      <CardTitle className="text-lg">Mining Sector</CardTitle>
                    </div>
                    <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50 dark:bg-orange-900/20">
                      {isLoadingMining ? "Loading..." : "Live"}
                    </Badge>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Copper Price</p>
                          <div className="flex items-baseline gap-1.5">
                            <p className="text-2xl font-semibold">
                              {isLoadingMining ? "..." : "$4.78"}
                            </p>
                            <Badge className="bg-red-500 hover:bg-red-600">-1.25%</Badge>
                          </div>
                        </div>
                        <div className="w-24 h-12">
                          <SparklineChart 
                            data={[48, 45, 47, 44, 42, 43, 41]}
                            color="#ef4444"
                            showTooltip={true}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Gold (oz)</p>
                          <div className="flex items-baseline gap-1.5">
                            <p className="text-lg font-semibold">
                              {isLoadingMining ? "..." : "$2,383.90"}
                            </p>
                            <span className="text-green-600 text-xs font-medium">+0.82%</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Lithium Index</p>
                          <div className="flex items-baseline gap-1.5">
                            <p className="text-lg font-semibold">
                              {isLoadingMining ? "..." : "324.5"}
                            </p>
                            <span className="text-red-600 text-xs font-medium">-2.1%</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-2">
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-1.5">Market Prediction</p>
                        <PredictionBadge
                          value={-0.7}
                          confidence={0.65}
                          factors={{
                            market_trend: 38,
                            volatility: 72,
                            sentiment: 45,
                            market_demand: 62
                          }}
                          size="md"
                          showConfidence={true}
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-slate-50 dark:bg-slate-800/50 border-t flex justify-between py-3">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {isLoadingMining ? "Loading data..." : "Updated 12 minutes ago"}
                    </p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-auto p-0 text-sm text-orange-600 hover:text-orange-800 dark:text-orange-400 dark:hover:text-orange-300"
                      onClick={() => navigate("/mining-market")}
                    >
                      View Details
                      <ChevronRight className="h-3 w-3 ml-1" />
                    </Button>
                  </CardFooter>
                </Card>
              );

            case "agriculture-overview":
              return (
                <Card key={id} className="overflow-hidden border-green-100 dark:border-green-900/40 hover:shadow-md transition-shadow">
                  <CardHeader className="bg-slate-50 dark:bg-slate-800/50 border-b flex flex-row items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Leaf className="h-5 w-5 text-green-600 dark:text-green-400" />
                      <CardTitle className="text-lg">Agriculture Market</CardTitle>
                    </div>
                    <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 dark:bg-green-900/20">
                      {isLoadingAgriculture ? "Loading..." : "Live"}
                    </Badge>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Wheat Price</p>
                          <div className="flex items-baseline gap-1.5">
                            <p className="text-2xl font-semibold">
                              {isLoadingAgriculture ? "..." : "$219.42"}
                            </p>
                            <Badge className="bg-green-500 hover:bg-green-600">+2.14%</Badge>
                          </div>
                        </div>
                        <div className="w-24 h-12">
                          <SparklineChart 
                            data={[32, 34, 38, 37, 42, 43, 45]}
                            color="#22c55e"
                            showTooltip={true}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Crop Yield</p>
                          <div className="flex items-baseline gap-1.5">
                            <p className="text-lg font-semibold">
                              {isLoadingAgriculture ? "..." : "4.2 t/ha"}
                            </p>
                            <span className="text-green-600 text-xs font-medium">+0.4%</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Export Volume</p>
                          <div className="flex items-baseline gap-1.5">
                            <p className="text-lg font-semibold">
                              {isLoadingAgriculture ? "..." : "128.3K tons"}
                            </p>
                            <span className="text-green-600 text-xs font-medium">+5.2%</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-2">
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-1.5">Market Prediction</p>
                        <PredictionBadge
                          value={2.5}
                          confidence={0.78}
                          factors={{
                            market_trend: 76,
                            volatility: 34,
                            sentiment: 68,
                            weather: 82
                          }}
                          size="md"
                          showConfidence={true}
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-slate-50 dark:bg-slate-800/50 border-t flex justify-between py-3">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {isLoadingAgriculture ? "Loading data..." : "Updated 20 minutes ago"}
                    </p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-auto p-0 text-sm text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                      onClick={() => navigate("/agriculture-market")}
                    >
                      View Details
                      <ChevronRight className="h-3 w-3 ml-1" />
                    </Button>
                  </CardFooter>
                </Card>
              );

            case "hydrogen-overview":
              return (
                <Card key={id} className="overflow-hidden border-teal-100 dark:border-teal-900/40 hover:shadow-md transition-shadow">
                  <CardHeader className="bg-slate-50 dark:bg-slate-800/50 border-b flex flex-row items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                      <CardTitle className="text-lg">Green Hydrogen</CardTitle>
                    </div>
                    <Badge variant="outline" className="text-teal-600 border-teal-200 bg-teal-50 dark:bg-teal-900/20">
                      {isLoadingHydrogen ? "Loading..." : "Live"}
                    </Badge>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Capacity</p>
                          <div className="flex items-baseline gap-1.5">
                            <p className="text-2xl font-semibold">
                              {isLoadingHydrogen ? "..." : "4,582 MW"}
                            </p>
                            <Badge className="bg-blue-500 hover:bg-blue-600">+18.5%</Badge>
                          </div>
                        </div>
                        <div className="w-24 h-12">
                          <SparklineChart 
                            data={[25, 32, 38, 42, 48, 52, 58]}
                            color="#3b82f6"
                            showTooltip={true}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Investment</p>
                          <div className="flex items-baseline gap-1.5">
                            <p className="text-lg font-semibold">
                              {isLoadingHydrogen ? "..." : "$3.2B"}
                            </p>
                            <span className="text-green-600 text-xs font-medium">+24.8%</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Efficiency</p>
                          <div className="flex items-baseline gap-1.5">
                            <p className="text-lg font-semibold">
                              {isLoadingHydrogen ? "..." : "72.4%"}
                            </p>
                            <span className="text-green-600 text-xs font-medium">+1.8%</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-2">
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-1.5">Market Prediction</p>
                        <PredictionBadge
                          value={5.2}
                          confidence={0.89}
                          factors={{
                            market_trend: 92,
                            volatility: 28,
                            sentiment: 87
                          }}
                          size="md"
                          showConfidence={true}
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-slate-50 dark:bg-slate-800/50 border-t flex justify-between py-3">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {isLoadingHydrogen ? "Loading data..." : "Updated 30 minutes ago"}
                    </p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-auto p-0 text-sm text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300"
                      onClick={() => navigate("/green-hydrogen-market")}
                    >
                      View Details
                      <ChevronRight className="h-3 w-3 ml-1" />
                    </Button>
                  </CardFooter>
                </Card>
              );
            default:
              return null;
          }
        })}
      </div>
      
      {/* News Feed Section */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <LayoutDashboard className="h-5 w-5" />
          Latest Market News
        </h2>
        <NewsFeed />
      </div>
    </div>
  );
};
