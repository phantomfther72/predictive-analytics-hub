import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, TrendingUp, AlertTriangle, Globe, Zap, MessageSquare, Loader2 } from 'lucide-react';
import { FilterControls } from '@/components/dashboard/FilterControls';
import { DateRange } from 'react-day-picker';
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
import { AIChat } from './AIChat';
import { WhatsAppBot } from './WhatsAppBot';
import { useIndustries, useDataPoints, useForecasts, type Industry } from '@/hooks/usePredictiveData';
import { IndustryCard } from '@/components/ui/IndustryCard';
import { PredictionMetric } from '@/components/ui/PredictionMetric';
import { PulseAlert } from '@/components/ui/PulseAlert';

export const PredictivePlatformDashboard = () => {
  const [selectedIndustry, setSelectedIndustry] = useState('overview');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [language, setLanguage] = useState<'en' | 'oshiwambo'>('en');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: industries = [], isLoading: industriesLoading } = useIndustries();
  const { data: dataPoints = [], isLoading: dataLoading } = useDataPoints(
    selectedIndustry !== 'overview' && selectedIndustry !== 'all' ? selectedIndustry : undefined,
    selectedRegion !== 'all' ? selectedRegion : undefined
  );
  const { data: forecasts = [], isLoading: forecastsLoading } = useForecasts(
    selectedIndustry !== 'overview' && selectedIndustry !== 'all' ? selectedIndustry : undefined,
    selectedRegion !== 'all' ? selectedRegion : undefined
  );

  // WhatsApp bot as a proper Industry object
  const whatsAppBotIndustry: Industry = {
    id: 'whatsapp',
    name: 'WhatsApp Bot',
    type: 'whatsapp',
    icon: '💬',
    description: 'AI Assistant Integration',
    color: '#25D366'
  };

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

  const handleRefreshData = async () => {
    setIsRefreshing(true);
    // Simulate API call delay
    setTimeout(() => {
      setIsRefreshing(false);
      // In real implementation, this would trigger the edge function
    }, 2000);
  };

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
    <div className="space-y-6">
      {/* Enhanced Filter Controls */}
      <FilterControls
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        selectedRegion={selectedRegion}
        onRegionChange={setSelectedRegion}
        selectedIndustry={selectedIndustry}
        onIndustryChange={setSelectedIndustry}
        onRefreshData={handleRefreshData}
        isRefreshing={isRefreshing}
      />

      <div className="space-y-8">
        <Tabs value={selectedIndustry} onValueChange={setSelectedIndustry}>
          <div className="mb-6">
            <IndustrySelector
              industries={[
                ...industries,
                whatsAppBotIndustry
              ]}
              selectedIndustry={selectedIndustry === 'overview' ? '' : selectedIndustry}
              onIndustrySelect={(industry) => setSelectedIndustry(industry || 'overview')}
              className="mb-4"
            />
          </div>

          <TabsContent value="overview" className="space-y-8">
            {/* Industry Overview Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {industryCards.map((industry) => (
                <IndustryCard
                  key={industry.id}
                  industry={industry}
                  onClick={() => setSelectedIndustry(industry.type)}
                />
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
                  <PredictionMetric
                    key={dataPoint.id}
                    title={dataPoint.metric_name}
                    value={dataPoint.value}
                    unit={dataPoint.unit}
                    prediction={forecast?.prediction}
                    confidence={forecast?.confidence_interval}
                    region={dataPoint.region}
                    timestamp={dataPoint.timestamp}
                  />
                ))}
              </div>
            </div>

            {/* Enhanced AI Assistant Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AIChat 
                language={language}
                selectedIndustry={selectedIndustry !== 'overview' ? selectedIndustry : undefined}
                selectedRegion={selectedRegion}
              />
              
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-green-400" />
                    {language === 'en' ? 'AI Insights Dashboard' : 'AI Omakusululo Dashboard'}
                  </CardTitle>
                  <CardDescription>
                    {language === 'en' 
                      ? 'Recent AI analysis and market intelligence'
                      : 'AI omakusululo nomakundelo gomakete'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Recent AI Insights */}
                  <div className="space-y-3">
                    <PulseAlert
                      title="Uranium Mining Outlook"
                      message="Uranium mining sector showing strong bullish signals based on global supply constraints."
                      severity="low"
                      type="prediction"
                      confidence={0.94}
                      timestamp={new Date(Date.now() - 2 * 60 * 1000).toISOString()}
                    />
                    
                    <PulseAlert
                      title="Housing Market Alert"
                      message="Windhoek housing market may experience seasonal correction in Q2 2025."
                      severity="medium"
                      type="market"
                      confidence={0.72}
                      timestamp={new Date(Date.now() - 15 * 60 * 1000).toISOString()}
                    />
                    
                    <PulseAlert
                      title="Green Hydrogen Trend"
                      message="Green hydrogen investments accelerating - 38% growth predicted for 2025."
                      severity="low"
                      type="trend"
                      confidence={0.85}
                      timestamp={new Date(Date.now() - 60 * 60 * 1000).toISOString()}
                    />
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full border-green-500/30 text-green-400"
                    onClick={() => setSelectedIndustry('whatsapp')}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Connect WhatsApp Bot
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Interactive Namibian Heatmap */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-green-400" />
                      Interactive Namibian Economic Heatmap
                    </CardTitle>
                    <CardDescription>
                      Real-time regional analytics with multi-dimensional data views
                    </CardDescription>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    Phase 6: Enhanced
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <NamibianHeatmap 
                  selectedIndustry={selectedIndustry !== 'overview' ? selectedIndustry : undefined}
                />
              </CardContent>
            </Card>

            {/* Forecasting as a Service */}
            <ForecastingService />
          </TabsContent>

          <TabsContent value="mining"><MiningDashboard language={language} /></TabsContent>
          <TabsContent value="housing"><HousingDashboard language={language} /></TabsContent>
          <TabsContent value="agriculture"><AgricultureDashboard language={language} /></TabsContent>
          <TabsContent value="medical"><MedicalDashboard language={language} /></TabsContent>
          <TabsContent value="green_hydrogen"><GreenHydrogenDashboard language={language} /></TabsContent>
          <TabsContent value="financial"><FinancialDashboard language={language} /></TabsContent>
          <TabsContent value="whatsapp">
            <WhatsAppBot language={language} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
