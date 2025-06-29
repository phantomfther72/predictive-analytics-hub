
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, TrendingUp, AlertTriangle, Globe, Zap, MessageSquare, Loader2 } from 'lucide-react';
import { NamibianHeatmap } from './NamibianHeatmap';
import { MiningDashboard } from './industry-dashboards/MiningDashboard';
import { HousingDashboard } from './industry-dashboards/HousingDashboard';
import { AgricultureDashboard } from './industry-dashboards/AgricultureDashboard';
import { MedicalDashboard } from './industry-dashboards/MedicalDashboard';
import { GreenHydrogenDashboard } from './industry-dashboards/GreenHydrogenDashboard';
import { FinancialDashboard } from './industry-dashboards/FinancialDashboard';
import { ForecastingService } from './ForecastingService';
import { LanguageToggle } from './LanguageToggle';
import { IndustrySelector } from './IndustrySelector';
import { RegionSelector } from './RegionSelector';
import { MetricCard } from './MetricCard';
import { AIAssistant } from './AIAssistant';
import { useIndustries, useDataPoints, useForecasts } from '@/hooks/usePredictiveData';

export const PredictivePlatformDashboard = () => {
  const [selectedIndustry, setSelectedIndustry] = useState('overview');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [language, setLanguage] = useState<'en' | 'oshiwambo'>('en');

  const { data: industries = [], isLoading: industriesLoading } = useIndustries();
  const { data: dataPoints = [], isLoading: dataLoading } = useDataPoints();
  const { data: forecasts = [], isLoading: forecastsLoading } = useForecasts();

  const industryCards = industries.map(industry => {
    const industryData = dataPoints.filter(dp => dp.industry_id === industry.id);
    const industryForecasts = forecasts.filter(f => f.industry_id === industry.id);
    
    const avgGrowth = industryForecasts.length > 0 
      ? industryForecasts.reduce((sum, f) => sum + f.prediction, 0) / industryForecasts.length
      : 0;
    
    const getRiskLevel = (growth: number) => {
      if (growth > 10) return 'low';
      if (growth > 0) return 'medium';
      return 'high';
    };
    
    return {
      ...industry,
      growth: avgGrowth,
      risk: getRiskLevel(avgGrowth),
      dataCount: industryData.length
    };
  });

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  // Get recent data points for overview
  const recentDataPoints = dataPoints
    .slice(0, 8)
    .map(dp => {
      const relatedForecast = forecasts.find(f => 
        f.industry_id === dp.industry_id && f.metric_name === dp.metric_name
      );
      return { dataPoint: dp, forecast: relatedForecast };
    });

  if (industriesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center">
        <div className="flex items-center space-x-2 text-white">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading Predictive Pulse...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-green-500/20 rounded-xl">
                <Globe className="h-8 w-8 text-green-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Predictive Pulse</h1>
                <p className="text-slate-400">Namibian Economic Intelligence Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <RegionSelector 
                selectedRegion={selectedRegion}
                onRegionSelect={setSelectedRegion}
                className="w-48"
              />
              <LanguageToggle language={language} onLanguageChange={setLanguage} />
              <Button size="sm" className="bg-green-500/20 text-green-400 border-green-500/30">
                <MessageSquare className="h-4 w-4 mr-2" />
                WhatsApp Bot
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={selectedIndustry} onValueChange={setSelectedIndustry}>
          <div className="mb-6">
            <IndustrySelector
              industries={industries}
              selectedIndustry={selectedIndustry === 'overview' ? '' : selectedIndustry}
              onIndustrySelect={(industry) => setSelectedIndustry(industry || 'overview')}
              className="mb-4"
            />
          </div>

          <TabsContent value="overview" className="space-y-8">
            {/* Industry Overview Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {industryCards.map((industry) => (
                <Card 
                  key={industry.id}
                  className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedIndustry(industry.type)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{industry.icon}</div>
                        <div>
                          <CardTitle className="text-white">{industry.name}</CardTitle>
                          <CardDescription>{industry.dataCount} active metrics</CardDescription>
                        </div>
                      </div>
                      <Badge className={getRiskColor(industry.risk)}>
                        {industry.risk.toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-green-400" />
                        <span className="text-green-400 font-bold">
                          {industry.growth > 0 ? '+' : ''}{industry.growth.toFixed(1)}%
                        </span>
                      </div>
                      <div className="text-xs text-slate-400">12M Forecast</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Key Metrics Grid */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Key Metrics Overview</h2>
                <Badge variant="outline" className="text-slate-400">
                  {dataLoading ? 'Loading...' : `${dataPoints.length} total metrics`}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {recentDataPoints.map(({ dataPoint, forecast }) => (
                  <MetricCard
                    key={dataPoint.id}
                    dataPoint={dataPoint}
                    forecast={forecast}
                  />
                ))}
              </div>
            </div>

            {/* Namibian Heatmap */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-green-400" />
                      Namibian Economic Heatmap
                    </CardTitle>
                    <CardDescription>Regional risk levels and investment flows</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-slate-400">Low Risk</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-xs text-slate-400">Medium Risk</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-xs text-slate-400">High Risk</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <NamibianHeatmap />
              </CardContent>
            </Card>

            {/* AI Assistant */}
            <AIAssistant />

            {/* Forecasting as a Service */}
            <ForecastingService />
          </TabsContent>

          <TabsContent value="mining"><MiningDashboard language={language} /></TabsContent>
          <TabsContent value="housing"><HousingDashboard language={language} /></TabsContent>
          <TabsContent value="agriculture"><AgricultureDashboard language={language} /></TabsContent>
          <TabsContent value="medical"><MedicalDashboard language={language} /></TabsContent>
          <TabsContent value="green_hydrogen"><GreenHydrogenDashboard language={language} /></TabsContent>
          <TabsContent value="financial"><FinancialDashboard language={language} /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
