
import React, { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Target, Zap, DollarSign } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';

interface FundConfig {
  sector: string;
  riskLevel: number;
  investment: number;
}

const FundBuilderTeaser = () => {
  const [config, setConfig] = useState<FundConfig>({
    sector: '',
    riskLevel: 50,
    investment: 10000
  });

  const [showResults, setShowResults] = useState(false);

  // Mock performance data
  const performanceData = [
    { month: 'Jan', value: 100 },
    { month: 'Feb', value: 105 },
    { month: 'Mar', value: 103 },
    { month: 'Apr', value: 112 },
    { month: 'May', value: 118 },
    { month: 'Jun', value: 125 },
  ];

  const handleBuildFund = () => {
    setShowResults(true);
  };

  const getRiskLabel = (risk: number) => {
    if (risk < 30) return 'Conservative';
    if (risk < 70) return 'Moderate';
    return 'Aggressive';
  };

  const getExpectedReturn = () => {
    const baseReturn = config.riskLevel * 0.2;
    const sectorMultiplier = config.sector === 'oil-gas' ? 1.3 : config.sector === 'mining' ? 1.2 : 1.0;
    return (baseReturn * sectorMultiplier).toFixed(1);
  };

  return (
    <section className="py-24 bg-gradient-to-b from-black to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Build Your <span className="text-green-400">AI Fund</span> in 3 Clicks
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            No more waiting for fund managers. Create your personalized AI-driven investment strategy 
            <span className="text-green-400 font-bold"> in under 60 seconds</span>.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Fund Builder Form */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white text-2xl flex items-center">
                <Target className="mr-3 h-6 w-6 text-green-400" />
                Customize Your Strategy
              </CardTitle>
              <CardDescription className="text-slate-300">
                Configure your AI fund parameters and watch predictions come to life
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Sector Selection */}
              <div className="space-y-3">
                <label className="text-white font-medium flex items-center">
                  <Zap className="mr-2 h-4 w-4 text-green-400" />
                  Focus Sector
                </label>
                <Select value={config.sector} onValueChange={(value) => setConfig(prev => ({...prev, sector: value}))}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Select your primary focus" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="equities">Global Equities</SelectItem>
                    <SelectItem value="oil-gas">Oil & Gas</SelectItem>
                    <SelectItem value="mining">Mining</SelectItem>
                    <SelectItem value="agriculture">Agriculture</SelectItem>
                    <SelectItem value="housing">Housing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Risk Level */}
              <div className="space-y-3">
                <label className="text-white font-medium flex items-center justify-between">
                  <span className="flex items-center">
                    <TrendingUp className="mr-2 h-4 w-4 text-green-400" />
                    Risk Level
                  </span>
                  <Badge variant="outline" className="border-green-500 text-green-400">
                    {getRiskLabel(config.riskLevel)}
                  </Badge>
                </label>
                <Slider
                  value={[config.riskLevel]}
                  onValueChange={(value) => setConfig(prev => ({...prev, riskLevel: value[0]}))}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Conservative</span>
                  <span>Moderate</span>
                  <span>Aggressive</span>
                </div>
              </div>

              {/* Investment Amount */}
              <div className="space-y-3">
                <label className="text-white font-medium flex items-center">
                  <DollarSign className="mr-2 h-4 w-4 text-green-400" />
                  Initial Investment
                </label>
                <Slider
                  value={[config.investment]}
                  onValueChange={(value) => setConfig(prev => ({...prev, investment: value[0]}))}
                  min={1000}
                  max={100000}
                  step={1000}
                  className="w-full"
                />
                <div className="text-center">
                  <span className="text-2xl font-bold text-green-400">
                    ${config.investment.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Build Button */}
              <Button
                onClick={handleBuildFund}
                disabled={!config.sector}
                className="w-full bg-gradient-to-r from-green-400 to-emerald-300 text-black font-bold py-3 text-lg hover:from-green-300 hover:to-emerald-200 transition-all duration-300"
              >
                <Zap className="mr-2 h-5 w-5" />
                Generate AI Fund Preview
              </Button>
            </CardContent>
          </Card>

          {/* Results Display */}
          <Card className={`bg-slate-800/50 border-slate-700 backdrop-blur-sm transition-all duration-500 ${
            showResults ? 'opacity-100 scale-100' : 'opacity-50 scale-95'
          }`}>
            <CardHeader>
              <CardTitle className="text-white text-2xl flex items-center">
                <TrendingUp className="mr-3 h-6 w-6 text-green-400" />
                Your AI Fund Preview
              </CardTitle>
              <CardDescription className="text-slate-300">
                Based on AI analysis and historical patterns
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {showResults && config.sector ? (
                <>
                  {/* Fund Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-green-950/30 border border-green-500/30 rounded-lg">
                      <div className="text-green-400 text-sm font-medium">Expected Annual Return</div>
                      <div className="text-white text-2xl font-bold">{getExpectedReturn()}%</div>
                    </div>
                    <div className="p-4 bg-blue-950/30 border border-blue-500/30 rounded-lg">
                      <div className="text-blue-400 text-sm font-medium">AI Confidence</div>
                      <div className="text-white text-2xl font-bold">87%</div>
                    </div>
                  </div>

                  {/* Performance Chart */}
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={performanceData}>
                        <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                        <YAxis stroke="#64748b" fontSize={12} />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#22c55e" 
                          strokeWidth={3}
                          dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Fund Details */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-300">Strategy Type:</span>
                      <Badge className="bg-green-500/20 text-green-400">
                        AI-Momentum + {config.sector.replace('-', ' & ').toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-300">Rebalancing:</span>
                      <span className="text-white">Daily (AI-Optimized)</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-300">Risk Score:</span>
                      <span className="text-green-400 font-bold">{config.riskLevel}/100</span>
                    </div>
                  </div>

                  {/* CTA */}
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-3 hover:from-blue-700 hover:to-blue-800">
                    Launch This Fund →
                  </Button>
                </>
              ) : (
                <div className="text-center py-12 text-slate-400">
                  <Target className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Configure your fund settings to see AI predictions</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default FundBuilderTeaser;
