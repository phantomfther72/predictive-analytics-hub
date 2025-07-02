
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, TrendingUp, AlertTriangle, BarChart3, Activity, Zap } from 'lucide-react';
import { useDataPoints, useForecasts, useHeatmaps } from '@/hooks/usePredictiveData';

interface NamibianHeatmapProps {
  selectedIndustry?: string;
  selectedMetric?: string;
}

export const NamibianHeatmap: React.FC<NamibianHeatmapProps> = ({ 
  selectedIndustry, 
  selectedMetric 
}) => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'risk' | 'growth' | 'investment'>('risk');
  const [timeRange, setTimeRange] = useState('1M');

  // Fetch real-time data
  const { data: dataPoints = [] } = useDataPoints(selectedIndustry);
  const { data: forecasts = [] } = useForecasts(selectedIndustry);
  const { data: heatmaps = [] } = useHeatmaps(selectedIndustry);

  // Enhanced regions with real-time data integration
  const enhanceRegionWithData = (baseRegion: any) => {
    // Get region-specific data points
    const regionData = dataPoints.filter(dp => dp.region.toLowerCase().includes(baseRegion.id.replace('-', ' ')));
    const regionForecasts = forecasts.filter(f => f.region.toLowerCase().includes(baseRegion.id.replace('-', ' ')));
    
    // Calculate dynamic metrics
    const avgForecast = regionForecasts.length > 0 
      ? regionForecasts.reduce((sum, f) => sum + f.prediction, 0) / regionForecasts.length
      : parseFloat(baseRegion.growth.replace('+', '').replace('%', ''));
    
    const dynamicRisk = avgForecast > 10 ? 'low' : avgForecast > 5 ? 'medium' : 'high';
    
    return {
      ...baseRegion,
      growth: `${avgForecast > 0 ? '+' : ''}${avgForecast.toFixed(1)}%`,
      risk: dynamicRisk,
      dataPoints: regionData.length,
      lastUpdate: regionData.length > 0 ? new Date(regionData[0].timestamp).toLocaleTimeString() : 'No data',
      activeMetrics: regionData.map(dp => dp.metric_name).slice(0, 3)
    };
  };

  const baseRegions = [
    { 
      id: 'windhoek', 
      name: 'Khomas (Windhoek)', 
      x: 50, 
      y: 60, 
      risk: 'low', 
      growth: '+8.2%',
      industries: ['Financial', 'Housing', 'Medical'],
      population: '431,000'
    },
    { 
      id: 'walvis-bay', 
      name: 'Erongo (Walvis Bay)', 
      x: 30, 
      y: 50, 
      risk: 'medium', 
      growth: '+12.4%',
      industries: ['Mining', 'Hydrogen', 'Logistics'],
      population: '178,000'
    },
    { 
      id: 'oshakati', 
      name: 'Oshana (Oshakati)', 
      x: 45, 
      y: 20, 
      risk: 'medium', 
      growth: '+6.7%',
      industries: ['Agriculture', 'Medical', 'Financial'],
      population: '196,000'
    },
    { 
      id: 'rundu', 
      name: 'Kavango East (Rundu)', 
      x: 70, 
      y: 25, 
      risk: 'high', 
      growth: '+3.1%',
      industries: ['Agriculture', 'Medical'],
      population: '223,000'
    },
    { 
      id: 'katima-mulilo', 
      name: 'Zambezi (Katima Mulilo)', 
      x: 85, 
      y: 25, 
      risk: 'high', 
      growth: '+2.8%',
      industries: ['Agriculture', 'Tourism'],
      population: '142,000'
    },
    { 
      id: 'luderitz', 
      name: 'ǡKaras (Lüderitz)', 
      x: 25, 
      y: 85, 
      risk: 'low', 
      growth: '+18.3%',
      industries: ['Hydrogen', 'Mining', 'Marine'],
      population: '78,000'
    },
    { 
      id: 'otjiwarongo', 
      name: 'Otjozondjupa (Otjiwarongo)', 
      x: 55, 
      y: 45, 
      risk: 'medium', 
      growth: '+9.1%',
      industries: ['Mining', 'Agriculture'],
      population: '185,000'
    }
  ];

  // Enhanced regions with real-time data
  const regions = baseRegions.map(enhanceRegionWithData);

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      // Data will refresh automatically via React Query
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const getViewModeColor = (region: any) => {
    if (viewMode === 'risk') {
      return getRiskColor(region.risk);
    } else if (viewMode === 'growth') {
      const growth = parseFloat(region.growth.replace('+', '').replace('%', ''));
      if (growth >= 15) return 'bg-green-500';
      if (growth >= 8) return 'bg-yellow-500';
      return 'bg-red-500';
    } else {
      // Investment mode - simulated investment flow data
      return Math.random() > 0.5 ? 'bg-blue-500' : 'bg-purple-500';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-red-500';
      default: return 'bg-slate-500';
    }
  };

  const getGrowthColor = (growth: string) => {
    const value = parseFloat(growth.replace('%', '').replace('+', ''));
    if (value >= 15) return 'text-green-400';
    if (value >= 8) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-6">
      {/* Interactive Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-800/30 rounded-lg border border-slate-700">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Activity className="h-4 w-4 text-green-400" />
            <span className="text-sm font-medium text-white">View Mode:</span>
          </div>
          <div className="flex space-x-1">
            {[
              { key: 'risk', label: 'Risk', icon: AlertTriangle },
              { key: 'growth', label: 'Growth', icon: TrendingUp },
              { key: 'investment', label: 'Investment', icon: BarChart3 }
            ].map(({ key, label, icon: Icon }) => (
              <Button
                key={key}
                variant={viewMode === key ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode(key as any)}
                className={viewMode === key 
                  ? "bg-green-500 hover:bg-green-600 text-white" 
                  : "border-slate-600 text-slate-300 hover:bg-slate-700"
                }
              >
                <Icon className="h-3 w-3 mr-1" />
                {label}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-24 h-8 bg-slate-700 border-slate-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1D">1D</SelectItem>
              <SelectItem value="1W">1W</SelectItem>
              <SelectItem value="1M">1M</SelectItem>
              <SelectItem value="3M">3M</SelectItem>
              <SelectItem value="1Y">1Y</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-slate-400">Live Data</span>
          </div>
        </div>
      </div>

      {/* Enhanced Map Container */}
      <div className="relative bg-slate-900/50 rounded-xl p-8 min-h-[500px] border border-slate-700">
        <svg
          viewBox="0 0 400 300"
          className="absolute inset-0 w-full h-full opacity-20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        >
          {/* Simplified Namibia outline */}
          <path
            d="M50 50 L50 280 L180 280 L180 250 L350 250 L350 200 L320 200 L320 150 L300 150 L300 100 L250 100 L250 80 L200 80 L200 60 L150 60 L150 50 Z"
            className="text-slate-600"
            fill="currentColor"
            fillOpacity="0.1"
          />
        </svg>

        {/* Region Markers */}
        {regions.map((region) => (
          <div
            key={region.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            style={{
              left: `${region.x}%`,
              top: `${region.y}%`
            }}
            onClick={() => setSelectedRegion(selectedRegion === region.id ? null : region.id)}
          >
            <div className={`w-4 h-4 rounded-full ${getViewModeColor(region)} animate-pulse shadow-lg`}>
              <div className={`w-4 h-4 rounded-full ${getViewModeColor(region)} opacity-50 animate-ping`}></div>
            </div>
            <div className="absolute top-5 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
              <div className="text-xs text-white font-medium bg-slate-800/80 px-2 py-1 rounded backdrop-blur-sm">
                {region.name.split('(')[1]?.replace(')', '') || region.name}
              </div>
            </div>
          </div>
        ))}

        {/* Selected Region Details */}
        {selectedRegion && (
          <Card className="absolute bottom-4 right-4 w-80 bg-slate-800/90 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-4">
              {(() => {
                const region = regions.find(r => r.id === selectedRegion);
                if (!region) return null;
                
                return (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white">{region.name}</h4>
                      <Badge className={`${getRiskColor(region.risk)} text-white`}>
                        {region.risk.toUpperCase()} RISK
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-slate-400">Population</div>
                        <div className="text-white font-medium">{region.population}</div>
                      </div>
                      <div>
                        <div className="text-slate-400">Growth Forecast</div>
                        <div className={`font-bold ${getGrowthColor(region.growth)}`}>
                          {region.growth}
                        </div>
                      </div>
                    </div>
                    
                     <div>
                       <div className="text-slate-400 text-sm mb-2">Key Industries</div>
                       <div className="flex flex-wrap gap-1">
                         {region.industries.map((industry) => (
                           <Badge key={industry} variant="outline" className="text-xs border-slate-600">
                             {industry}
                           </Badge>
                         ))}
                       </div>
                     </div>
                     
                     {/* Real-time Data Section */}
                     <div className="border-t border-slate-600 pt-3">
                       <div className="flex items-center justify-between mb-2">
                         <span className="text-xs text-slate-400">Live Data Points</span>
                         <span className="text-xs text-green-400">{region.dataPoints} active</span>
                       </div>
                       
                       {region.activeMetrics && region.activeMetrics.length > 0 && (
                         <div className="space-y-1">
                           {region.activeMetrics.map((metric: string, index: number) => (
                             <div key={index} className="flex items-center justify-between text-xs">
                               <span className="text-slate-300">{metric}</span>
                               <Zap className="h-3 w-3 text-green-400" />
                             </div>
                           ))}
                         </div>
                       )}
                       
                       <div className="mt-2 text-xs text-slate-500">
                         Last update: {region.lastUpdate}
                       </div>
                     </div>
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <MapPin className="h-4 w-4 text-slate-400" />
          <span className="text-slate-400">Click regions for details</span>
        </div>
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-4 w-4 text-green-400" />
          <span className="text-slate-400">Growth forecast</span>
        </div>
        <div className="flex items-center space-x-2">
          <AlertTriangle className="h-4 w-4 text-yellow-400" />
          <span className="text-slate-400">Risk levels</span>
        </div>
      </div>
    </div>
  );
};
