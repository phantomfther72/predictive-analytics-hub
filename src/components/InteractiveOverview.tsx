
import React, { useEffect, useState } from 'react';
import { TrendingUp, Droplets, Pickaxe, Wheat, Home, DollarSign } from 'lucide-react';

interface MarketSector {
  id: string;
  name: string;
  icon: React.ReactNode;
  signal: string;
  confidence: number;
  change: number;
  position: { x: number; y: number };
}

const InteractiveOverview = () => {
  const [activeSignal, setActiveSignal] = useState(0);

  const marketSectors: MarketSector[] = [
    {
      id: 'equities',
      name: 'Global Equities',
      icon: <TrendingUp className="h-6 w-6" />,
      signal: 'Growth Signal',
      confidence: 84,
      change: 2.4,
      position: { x: 20, y: 30 }
    },
    {
      id: 'oil-gas',
      name: 'Oil & Gas',
      icon: <Droplets className="h-6 w-6" />,
      signal: 'Bull Signal',
      confidence: 72,
      change: 5.2,
      position: { x: 60, y: 25 }
    },
    {
      id: 'mining',
      name: 'Mining',
      icon: <Pickaxe className="h-6 w-6" />,
      signal: 'Recovery Signal',
      confidence: 68,
      change: 1.8,
      position: { x: 75, y: 60 }
    },
    {
      id: 'agriculture',
      name: 'Agriculture',
      icon: <Wheat className="h-6 w-6" />,
      signal: 'Stable Signal',
      confidence: 91,
      change: 0.7,
      position: { x: 30, y: 70 }
    },
    {
      id: 'housing',
      name: 'Housing',
      icon: <Home className="h-6 w-6" />,
      signal: 'Expansion Signal',
      confidence: 76,
      change: 3.1,
      position: { x: 45, y: 45 }
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSignal(prev => (prev + 1) % marketSectors.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [marketSectors.length]);

  return (
    <section className="py-24 bg-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Real-Time Market Intelligence
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Watch AI analyze global markets in real-time. From Namibian mining to international oil markets—
            <span className="text-green-400 font-bold"> our algorithms never sleep</span>.
          </p>
        </div>

        {/* Interactive World Map Visual */}
        <div className="relative">
          {/* Map Container */}
          <div className="relative h-96 bg-gradient-to-b from-slate-800/50 to-slate-900/50 rounded-3xl border border-slate-700 overflow-hidden backdrop-blur-sm">
            {/* Background Grid */}
            <div className="absolute inset-0 opacity-20">
              <div className="w-full h-full" style={{
                backgroundImage: `
                  linear-gradient(rgba(34, 197, 94, 0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px'
              }} />
            </div>

            {/* Market Sector Indicators */}
            {marketSectors.map((sector, index) => (
              <div
                key={sector.id}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ${
                  activeSignal === index ? 'scale-125 z-10' : 'scale-100'
                }`}
                style={{
                  left: `${sector.position.x}%`,
                  top: `${sector.position.y}%`
                }}
              >
                <div className={`relative p-4 rounded-2xl border-2 backdrop-blur-sm transition-all duration-500 ${
                  activeSignal === index 
                    ? 'bg-green-500/20 border-green-400 shadow-lg shadow-green-500/25' 
                    : 'bg-slate-800/50 border-slate-600 hover:border-green-500/50'
                }`}>
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg transition-colors ${
                      activeSignal === index ? 'bg-green-400 text-black' : 'bg-slate-700 text-green-400'
                    }`}>
                      {sector.icon}
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">{sector.name}</div>
                      <div className="text-xs text-green-400">{sector.signal}</div>
                    </div>
                  </div>
                  
                  {activeSignal === index && (
                    <div className="mt-3 pt-3 border-t border-green-400/30">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-300">Confidence:</span>
                        <span className="text-green-400 font-bold">{sector.confidence}%</span>
                      </div>
                      <div className="flex justify-between items-center text-xs mt-1">
                        <span className="text-slate-300">Change:</span>
                        <span className={`font-bold ${sector.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {sector.change >= 0 ? '+' : ''}{sector.change}%
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Pulse animation for active sector */}
                  {activeSignal === index && (
                    <div className="absolute inset-0 rounded-2xl border-2 border-green-400 animate-ping" />
                  )}
                </div>
              </div>
            ))}

            {/* Center logo/indicator */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="p-6 bg-gradient-to-r from-green-400 to-emerald-300 rounded-full shadow-2xl">
                <DollarSign className="h-8 w-8 text-black" />
              </div>
              <div className="absolute inset-0 rounded-full bg-green-400/20 animate-ping" />
            </div>
          </div>

          {/* Active Signal Display */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center px-8 py-4 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl">
              <div className="mr-4">
                {marketSectors[activeSignal].icon}
              </div>
              <div className="text-left">
                <div className="font-bold text-white text-lg">
                  {marketSectors[activeSignal].name}
                </div>
                <div className="text-green-400 text-sm">
                  {marketSectors[activeSignal].signal} • {marketSectors[activeSignal].confidence}% Confidence
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveOverview;
