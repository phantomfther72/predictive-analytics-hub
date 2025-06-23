
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Globe, DollarSign, Briefcase, Target } from "lucide-react";
import { GlobalEquityData, MarketRegion, AssetClass } from "@/types/global-equity";
import { GlobalMarketOverview } from "./GlobalMarketOverview";
import { GlobalEquityChart } from "./GlobalEquityChart";
import { FundBuilder } from "./FundBuilder";
import { PredictiveSignals } from "./PredictiveSignals";

interface GlobalEquityDashboardProps {
  className?: string;
}

export const GlobalEquityDashboard: React.FC<GlobalEquityDashboardProps> = ({ className }) => {
  const [selectedRegion, setSelectedRegion] = useState<MarketRegion | 'all'>('all');
  const [selectedAssetClass, setSelectedAssetClass] = useState<AssetClass | 'all'>('all');

  // Mock data for demonstration - will be replaced with real API calls
  const mockGlobalData: GlobalEquityData[] = [
    {
      id: '1',
      symbol: 'AAPL',
      name: 'Apple Inc.',
      exchange: 'NASDAQ',
      region: 'developed',
      asset_class: 'equity',
      current_price: 175.43,
      currency: 'USD',
      market_cap: 2800000000000,
      volume_24h: 52000000,
      change_24h: 2.15,
      change_percentage_24h: 1.24,
      timestamp: new Date().toISOString(),
      predicted_change: 3.2,
      prediction_confidence: 0.78,
      prediction_explanation: "Strong earnings momentum and AI growth trajectory",
    },
    {
      id: '2',
      symbol: 'GLD',
      name: 'Gold ETF',
      exchange: 'NYSE',
      region: 'developed',
      asset_class: 'commodity',
      commodity_type: 'gold',
      current_price: 186.75,
      currency: 'USD',
      volume_24h: 8500000,
      change_24h: -1.25,
      change_percentage_24h: -0.67,
      timestamp: new Date().toISOString(),
      predicted_change: -2.1,
      prediction_confidence: 0.65,
      prediction_explanation: "Federal Reserve hawkish stance pressuring precious metals",
    },
    {
      id: '3',
      symbol: 'XOM',
      name: 'Exxon Mobil Corporation',
      exchange: 'NYSE',
      region: 'developed',
      asset_class: 'commodity',
      commodity_type: 'oil',
      current_price: 112.45,
      currency: 'USD',
      volume_24h: 18000000,
      change_24h: 4.32,
      change_percentage_24h: 3.99,
      timestamp: new Date().toISOString(),
      predicted_change: 5.8,
      prediction_confidence: 0.82,
      prediction_explanation: "OPEC+ production cuts and geopolitical tensions driving oil prices higher",
    }
  ];

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Global Equity Platform
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mt-2">
            AI-powered investment platform with real-time global market access
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Markets
          </Button>
          <Button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-teal-600">
            <Briefcase className="h-4 w-4" />
            Create Fund
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Global Markets</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> coverage expansion
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Strategies</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-blue-600">+3</span> new this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Predictions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+5%</span> accuracy this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total AUM</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2.4M</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+18%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Market Overview</TabsTrigger>
          <TabsTrigger value="charts">Advanced Charts</TabsTrigger>
          <TabsTrigger value="fund-builder">Fund Builder</TabsTrigger>
          <TabsTrigger value="signals">AI Signals</TabsTrigger>
          <TabsTrigger value="portfolio">My Portfolio</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <GlobalMarketOverview 
            data={mockGlobalData}
            selectedRegion={selectedRegion}
            selectedAssetClass={selectedAssetClass}
            onRegionChange={setSelectedRegion}
            onAssetClassChange={setSelectedAssetClass}
          />
        </TabsContent>

        <TabsContent value="charts" className="space-y-6">
          <GlobalEquityChart data={mockGlobalData} />
        </TabsContent>

        <TabsContent value="fund-builder" className="space-y-6">
          <FundBuilder />
        </TabsContent>

        <TabsContent value="signals" className="space-y-6">
          <PredictiveSignals data={mockGlobalData} />
        </TabsContent>

        <TabsContent value="portfolio" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Management</CardTitle>
              <CardDescription>
                Manage your custom funds and track performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  Create your first AI-powered fund to get started
                </p>
                <Button className="bg-gradient-to-r from-blue-600 to-teal-600">
                  <Briefcase className="h-4 w-4 mr-2" />
                  Create Your First Fund
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
