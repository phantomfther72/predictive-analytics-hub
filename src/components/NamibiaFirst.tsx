
import React from 'react';
import { MapPin, TrendingUp, Droplets, Pickaxe, Home, Wheat } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const NamibiaFirst = () => {
  const namibianSectors = [
    {
      icon: <Pickaxe className="h-8 w-8" />,
      title: "Mining Excellence",
      description: "Diamond, uranium, and lithium mining insights with geological AI predictions",
      signal: "Strong Growth",
      confidence: 89,
      change: "+12.4%"
    },
    {
      icon: <Droplets className="h-8 w-8" />,
      title: "Oil & Gas Exploration",
      description: "Track offshore drilling progress and energy sector developments",
      signal: "High Potential",
      confidence: 76,
      change: "+8.7%"
    },
    {
      icon: <Wheat className="h-8 w-8" />,
      title: "Agricultural Innovation",
      description: "Cattle farming, crop yields, and climate-adapted agriculture analytics",
      signal: "Stable Growth",
      confidence: 94,
      change: "+3.2%"
    },
    {
      icon: <Home className="h-8 w-8" />,
      title: "Infrastructure Boom",
      description: "Housing development, port expansion, and smart city initiatives",
      signal: "Rapid Expansion",
      confidence: 82,
      change: "+15.1%"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-slate-900 to-black relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2322c55e' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-6 py-3 bg-green-950/30 border border-green-500/30 rounded-full mb-6">
            <MapPin className="h-5 w-5 text-green-400 mr-2" />
            <span className="text-green-400 font-bold">Namibia Focus</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            <span className="text-green-400">Namibia First</span>, Global Always
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            We understand the Namibian market like no one else. Our AI models are trained on local economic patterns, 
            seasonal cycles, and emerging opportunities that global platforms miss.
          </p>
        </div>

        {/* Namibian Sectors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {namibianSectors.map((sector, index) => (
            <Card 
              key={index} 
              className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300 group"
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-green-500/20 rounded-xl text-green-400 group-hover:bg-green-500/30 transition-colors">
                      {sector.icon}
                    </div>
                    <div>
                      <CardTitle className="text-white text-xl">{sector.title}</CardTitle>
                      <CardDescription className="text-slate-300">
                        AI-powered Namibian insights
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    {sector.signal}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 mb-4 leading-relaxed">
                  {sector.description}
                </p>
                
                {/* Metrics */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                  <div className="flex items-center space-x-4">
                    <div>
                      <div className="text-xs text-slate-400">AI Confidence</div>
                      <div className="text-green-400 font-bold">{sector.confidence}%</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400">12M Projection</div>
                      <div className="text-green-400 font-bold">{sector.change}</div>
                    </div>
                  </div>
                  <TrendingUp className="h-5 w-5 text-green-400" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Dashboard Preview */}
        <div className="text-center mb-12">
          <h3 className="text-2xl font-bold text-white mb-6">
            Live Namibian Market Dashboard
          </h3>
          <p className="text-slate-300 mb-8">
            Get real-time insights into local economic indicators and investment opportunities
          </p>
        </div>

        {/* Mock Dashboard Preview */}
        <div className="bg-slate-800/30 border border-slate-700 rounded-3xl p-8 backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="p-4 bg-green-950/30 border border-green-500/30 rounded-xl">
              <div className="text-green-400 text-sm font-medium mb-1">Windhoek Stock Exchange</div>
              <div className="text-white text-2xl font-bold">+2.4%</div>
              <div className="text-xs text-slate-400">Live tracking</div>
            </div>
            <div className="p-4 bg-blue-950/30 border border-blue-500/30 rounded-xl">
              <div className="text-blue-400 text-sm font-medium mb-1">NAD/USD Rate</div>
              <div className="text-white text-2xl font-bold">0.0547</div>
              <div className="text-xs text-slate-400">Real-time FX</div>
            </div>
            <div className="p-4 bg-purple-950/30 border border-purple-500/30 rounded-xl">
              <div className="text-purple-400 text-sm font-medium mb-1">Active Predictions</div>
              <div className="text-white text-2xl font-bold">127</div>
              <div className="text-xs text-slate-400">AI signals</div>
            </div>
          </div>
          
          <div className="text-center">
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 px-4 py-2">
              🇳🇦 Powered by Local Market Intelligence
            </Badge>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NamibiaFirst;
