
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, TrendingDown, Mountain, AlertTriangle, BarChart3, LineChart } from 'lucide-react';
import { useDataPoints, useForecasts } from '@/hooks/usePredictiveData';
import { RegionSelector } from '../RegionSelector';
import { MiningMetricsChart } from './charts/MiningMetricsChart';
import { MiningForecastChart } from './charts/MiningForecastChart';
import { MiningRiskAssessment } from './MiningRiskAssessment';

interface MiningDashboardProps {
  language: 'en' | 'oshiwambo';
}

export const MiningDashboard: React.FC<MiningDashboardProps> = ({ language }) => {
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedTimeframe, setSelectedTimeframe] = useState('6M');
  const [activeTab, setActiveTab] = useState('overview');
  
  // Get mining industry ID (assuming it's the first one for now)
  const miningIndustryId = 'mining';
  
  const { data: dataPoints = [], isLoading: loadingData } = useDataPoints(miningIndustryId, selectedRegion);
  const { data: forecasts = [], isLoading: loadingForecasts } = useForecasts(miningIndustryId, selectedRegion);

  // Process data for different metrics
  const commodityData = React.useMemo(() => {
    const commodities = ['Uranium', 'Diamonds', 'Gold', 'Copper', 'Zinc', 'Lead'];
    return commodities.map(commodity => {
      const commodityPoints = dataPoints.filter(dp => 
        dp.metric_name.toLowerCase().includes(commodity.toLowerCase())
      );
      const commodityForecasts = forecasts.filter(f => 
        f.metric_name.toLowerCase().includes(commodity.toLowerCase())
      );
      
      const latestProduction = commodityPoints.find(dp => dp.metric_name.includes('production'))?.value || 0;
      const latestValue = commodityPoints.find(dp => dp.metric_name.includes('value'))?.value || 0;
      const avgForecast = commodityForecasts.reduce((sum, f) => sum + f.prediction, 0) / (commodityForecasts.length || 1);
      
      return {
        commodity,
        production: latestProduction,
        marketValue: latestValue,
        forecast: avgForecast,
        confidence: commodityForecasts[0]?.confidence_interval || 0.7,
        risk: avgForecast > 5 ? 'low' : avgForecast > 0 ? 'medium' : 'high'
      };
    });
  }, [dataPoints, forecasts]);

  const overviewMetrics = React.useMemo(() => {
    const totalProduction = dataPoints
      .filter(dp => dp.metric_name.includes('production'))
      .reduce((sum, dp) => sum + dp.value, 0);
    
    const totalValue = dataPoints
      .filter(dp => dp.metric_name.includes('value'))
      .reduce((sum, dp) => sum + dp.value, 0);
    
    const avgGrowth = forecasts.reduce((sum, f) => sum + f.prediction, 0) / (forecasts.length || 1);
    
    return {
      totalProduction: totalProduction / 1000000, // Convert to million tons
      totalValue: totalValue / 1000000000, // Convert to billions USD
      avgGrowth,
      activeMines: commodityData.length,
      riskLevel: avgGrowth > 5 ? 'low' : avgGrowth > 0 ? 'medium' : 'high'
    };
  }, [dataPoints, forecasts, commodityData]);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  if (loadingData || loadingForecasts) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-slate-700 rounded w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-slate-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-amber-500/20 rounded-xl">
            <Mountain className="h-6 w-6 text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">
              {language === 'en' ? 'Mining Industry Dashboard' : 'Omuti gwOmainda'}
            </h1>
            <p className="text-slate-400">
              {language === 'en' ? 'Real-time mining sector insights and forecasts' : 'Ondudhu zomainda nokukula kwayo'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <RegionSelector 
            selectedRegion={selectedRegion}
            onRegionSelect={setSelectedRegion}
            className="w-48"
          />
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1M">1M</SelectItem>
              <SelectItem value="3M">3M</SelectItem>
              <SelectItem value="6M">6M</SelectItem>
              <SelectItem value="1Y">1Y</SelectItem>
              <SelectItem value="ALL">All</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-slate-400">Total Production</CardDescription>
            <CardTitle className="text-2xl text-white flex items-center">
              {overviewMetrics.totalProduction.toFixed(1)}M 
              <span className="text-sm text-slate-400 ml-1">tons</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              <TrendingUp className="h-3 w-3 mr-1" />
              +8.2% YoY
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-slate-400">Market Value</CardDescription>
            <CardTitle className="text-2xl text-white flex items-center">
              ${overviewMetrics.totalValue.toFixed(1)}B
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12.5% YoY
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-slate-400">Growth Forecast</CardDescription>
            <CardTitle className="text-2xl text-white flex items-center">
              {overviewMetrics.avgGrowth > 0 ? '+' : ''}
              {overviewMetrics.avgGrowth.toFixed(1)}%
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className={getRiskColor(overviewMetrics.riskLevel)}>
              12M Outlook
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-slate-400">Risk Assessment</CardDescription>
            <CardTitle className="text-2xl text-white flex items-center">
              {overviewMetrics.riskLevel.toUpperCase()}
              {overviewMetrics.riskLevel === 'high' && <AlertTriangle className="h-5 w-5 ml-2 text-red-400" />}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className={getRiskColor(overviewMetrics.riskLevel)}>
              Market Risk
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="commodities">Commodities</TabsTrigger>
          <TabsTrigger value="forecasts">Forecasts</TabsTrigger>
          <TabsTrigger value="risks">Risk Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-amber-400" />
                  Production Trends
                </CardTitle>
                <CardDescription>Monthly production volumes by commodity</CardDescription>
              </CardHeader>
              <CardContent>
                <MiningMetricsChart 
                  data={dataPoints.filter(dp => dp.metric_name.includes('production'))}
                  timeframe={selectedTimeframe}
                />
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <LineChart className="h-5 w-5 mr-2 text-green-400" />
                  Market Values
                </CardTitle>
                <CardDescription>Commodity market values over time</CardDescription>
              </CardHeader>
              <CardContent>
                <MiningMetricsChart 
                  data={dataPoints.filter(dp => dp.metric_name.includes('value'))}
                  timeframe={selectedTimeframe}
                />
              </CardContent>
            </Card>
          </div>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Top Performing Commodities</CardTitle>
              <CardDescription>Current production leaders and market performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-3 text-slate-400">Commodity</th>
                      <th className="text-right py-3 text-slate-400">Production</th>
                      <th className="text-right py-3 text-slate-400">Market Value</th>
                      <th className="text-right py-3 text-slate-400">12M Forecast</th>
                      <th className="text-right py-3 text-slate-400">Risk</th>
                    </tr>
                  </thead>
                  <tbody>
                    {commodityData.slice(0, 5).map((item, index) => (
                      <tr key={item.commodity} className="border-b border-slate-700/50">
                        <td className="py-3 text-white font-medium">{item.commodity}</td>
                        <td className="py-3 text-right text-slate-300">
                          {(item.production / 1000).toFixed(1)}K tons
                        </td>
                        <td className="py-3 text-right text-slate-300">
                          ${(item.marketValue / 1000000).toFixed(1)}M
                        </td>
                        <td className="py-3 text-right">
                          <span className={item.forecast >= 0 ? 'text-green-400' : 'text-red-400'}>
                            {item.forecast >= 0 ? '+' : ''}{item.forecast.toFixed(1)}%
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <Badge className={getRiskColor(item.risk)} variant="outline">
                            {item.risk.toUpperCase()}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="commodities" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {commodityData.map((commodity) => (
              <Card key={commodity.commodity} className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-lg">{commodity.commodity}</CardTitle>
                  <CardDescription>Current market status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Production:</span>
                    <span className="text-white font-medium">
                      {(commodity.production / 1000).toFixed(1)}K tons
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Market Value:</span>
                    <span className="text-white font-medium">
                      ${(commodity.marketValue / 1000000).toFixed(1)}M
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">12M Forecast:</span>
                    <div className="flex items-center space-x-2">
                      {commodity.forecast >= 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-400" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-400" />
                      )}
                      <span className={commodity.forecast >= 0 ? 'text-green-400' : 'text-red-400'}>
                        {commodity.forecast >= 0 ? '+' : ''}{commodity.forecast.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="pt-2">
                    <Badge className={getRiskColor(commodity.risk)} variant="outline">
                      {commodity.risk.toUpperCase()} RISK
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="forecasts" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">AI-Powered Forecasts</CardTitle>
              <CardDescription>Machine learning predictions for the next 12 months</CardDescription>
            </CardHeader>
            <CardContent>
              <MiningForecastChart 
                forecasts={forecasts}
                dataPoints={dataPoints}
                timeframe={selectedTimeframe}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risks" className="space-y-6">
          <MiningRiskAssessment 
            commodityData={commodityData}
            forecasts={forecasts}
            selectedRegion={selectedRegion}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
