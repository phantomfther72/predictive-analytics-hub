import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Zap,
  BarChart3,
  Globe
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface MarketData {
  id: string;
  sector: string;
  instrument: string;
  value: number;
  change: number;
  changePercent: number;
  volume: number;
  status: 'normal' | 'volatile' | 'alert';
  correlations: string[];
  lastUpdate: Date;
}

const mockData: MarketData[] = [
  {
    id: '1',
    sector: 'Housing',
    instrument: 'NAM-HOUSE-INDEX',
    value: 1247.5,
    change: 23.7,
    changePercent: 1.94,
    volume: 45000,
    status: 'normal',
    correlations: ['Mining', 'Agriculture'],
    lastUpdate: new Date()
  },
  {
    id: '2',
    sector: 'Mining',
    instrument: 'COPPER-NAM',
    value: 8924.3,
    change: -156.8,
    changePercent: -1.73,
    volume: 128000,
    status: 'volatile',
    correlations: ['Currency', 'Global'],
    lastUpdate: new Date()
  },
  {
    id: '3',
    sector: 'Agriculture',
    instrument: 'MAIZE-FUTURES',
    value: 2847.2,
    change: 89.4,
    changePercent: 3.24,
    volume: 67000,
    status: 'alert',
    correlations: ['Climate', 'Trade'],
    lastUpdate: new Date()
  }
];

const chartData = [
  { time: '09:00', value: 1200, volume: 20000 },
  { time: '10:00', value: 1215, volume: 35000 },
  { time: '11:00', value: 1198, volume: 28000 },
  { time: '12:00', value: 1247, volume: 45000 },
];

export const LiveMarketFeed: React.FC = () => {
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [marketData, setMarketData] = useState<MarketData[]>(mockData);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketData(prev => prev.map(item => ({
        ...item,
        value: item.value + (Math.random() - 0.5) * 10,
        change: item.change + (Math.random() - 0.5) * 5,
        lastUpdate: new Date()
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'alert': return 'hsl(var(--terminal-error))';
      case 'volatile': return 'hsl(var(--terminal-warning))';
      default: return 'hsl(var(--terminal-success))';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'alert': return <AlertTriangle className="h-3 w-3" />;
      case 'volatile': return <Zap className="h-3 w-3" />;
      default: return <BarChart3 className="h-3 w-3" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Real-time Chart */}
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="marketGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--pulse-orange))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--pulse-orange))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="time" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'hsl(var(--terminal-text-dim))' }}
            />
            <YAxis hide />
            <Area
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--pulse-orange))"
              fillOpacity={1}
              fill="url(#marketGradient)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Live Data Stream */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium" style={{ color: 'hsl(var(--terminal-text))' }}>
            Live Market Correlations
          </h4>
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-[hsl(var(--terminal-success))] animate-pulse" />
            <span className="text-xs" style={{ color: 'hsl(var(--terminal-text-dim))' }}>
              Live
            </span>
          </div>
        </div>

        {marketData.map((item) => (
          <Card 
            key={item.id}
            className="p-3 border-0"
            style={{ 
              background: 'hsl(var(--terminal-bg))',
              borderLeft: `3px solid ${getStatusColor(item.status)}`
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div style={{ color: getStatusColor(item.status) }}>
                  {getStatusIcon(item.status)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm" style={{ color: 'hsl(var(--terminal-text))' }}>
                      {item.instrument}
                    </span>
                    <Badge 
                      variant="outline" 
                      className="text-xs border-[hsl(var(--terminal-border))] text-[hsl(var(--terminal-text-dim))]"
                    >
                      {item.sector}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs" style={{ color: 'hsl(var(--terminal-text-dim))' }}>
                      Correlations:
                    </span>
                    {item.correlations.map((correlation, idx) => (
                      <Badge 
                        key={idx}
                        variant="outline"
                        className="text-xs border-[hsl(var(--electric-blue))] text-[hsl(var(--electric-blue))]"
                      >
                        {correlation}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-lg font-bold" style={{ color: 'hsl(var(--terminal-text-bright))' }}>
                  {item.value.toFixed(1)}
                </div>
                <div className={`text-sm flex items-center gap-1 ${
                  item.change >= 0 ? 'text-[hsl(var(--terminal-success))]' : 'text-[hsl(var(--terminal-error))]'
                }`}>
                  {item.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {item.change.toFixed(1)} ({item.changePercent.toFixed(2)}%)
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2 flex-wrap">
        <Button 
          size="sm" 
          variant="outline"
          className="border-[hsl(var(--pulse-orange))] text-[hsl(var(--pulse-orange))] hover:bg-[hsl(var(--pulse-orange))] hover:text-black"
        >
          <Globe className="h-3 w-3 mr-1" />
          Global View
        </Button>
        <Button 
          size="sm" 
          variant="outline"
          className="border-[hsl(var(--electric-blue))] text-[hsl(var(--electric-blue))] hover:bg-[hsl(var(--electric-blue))] hover:text-black"
        >
          <Zap className="h-3 w-3 mr-1" />
          Anomaly Detection
        </Button>
      </div>
    </div>
  );
};