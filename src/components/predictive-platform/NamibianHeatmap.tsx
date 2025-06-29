
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, TrendingUp, AlertTriangle } from 'lucide-react';

export const NamibianHeatmap = () => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const regions = [
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
      name: 'ǁKaras (Lüderitz)', 
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
    <div className="relative">
      {/* Namibia Map Outline */}
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
            <div className={`w-4 h-4 rounded-full ${getRiskColor(region.risk)} animate-pulse shadow-lg`}>
              <div className={`w-4 h-4 rounded-full ${getRiskColor(region.risk)} opacity-50 animate-ping`}></div>
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
