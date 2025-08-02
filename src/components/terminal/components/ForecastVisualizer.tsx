import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { 
  Map, 
  Sliders, 
  Play, 
  RotateCcw, 
  Download,
  Globe,
  Zap
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface ScenarioParams {
  supplyShock: number;
  climateImpact: number;
  demandShift: number;
  policyChange: number;
}

export const ForecastVisualizer: React.FC = () => {
  const [selectedSector, setSelectedSector] = useState('agriculture');
  const [isRunning, setIsRunning] = useState(false);
  const [scenarioParams, setScenarioParams] = useState<ScenarioParams>({
    supplyShock: 0,
    climateImpact: 0,
    demandShift: 0,
    policyChange: 0
  });

  const sectors = [
    { id: 'agriculture', name: 'Agriculture', color: 'hsl(var(--terminal-success))' },
    { id: 'mining', name: 'Mining', color: 'hsl(var(--pulse-orange))' },
    { id: 'housing', name: 'Housing', color: 'hsl(var(--electric-blue))' },
    { id: 'currency', name: 'Currency', color: 'hsl(var(--terminal-warning))' }
  ];

  // Mock forecast data based on scenario parameters
  const generateForecastData = () => {
    const baseData = [
      { month: 'Jan', baseline: 100, scenario: 100 },
      { month: 'Feb', baseline: 102, scenario: 102 },
      { month: 'Mar', baseline: 98, scenario: 98 },
      { month: 'Apr', baseline: 105, scenario: 105 },
      { month: 'May', baseline: 108, scenario: 108 },
      { month: 'Jun', baseline: 112, scenario: 112 },
    ];

    return baseData.map(point => ({
      ...point,
      scenario: point.baseline + 
        (scenarioParams.supplyShock * -0.5) +
        (scenarioParams.climateImpact * -0.3) +
        (scenarioParams.demandShift * 0.4) +
        (scenarioParams.policyChange * 0.2)
    }));
  };

  const forecastData = generateForecastData();

  const runSimulation = () => {
    setIsRunning(true);
    setTimeout(() => setIsRunning(false), 2000);
  };

  const resetParams = () => {
    setScenarioParams({
      supplyShock: 0,
      climateImpact: 0,
      demandShift: 0,
      policyChange: 0
    });
  };

  return (
    <div className="space-y-4">
      {/* Sector Selection */}
      <div className="flex gap-2 flex-wrap">
        {sectors.map((sector) => (
          <Button
            key={sector.id}
            size="sm"
            variant={selectedSector === sector.id ? "default" : "outline"}
            onClick={() => setSelectedSector(sector.id)}
            className={`
              ${selectedSector === sector.id 
                ? 'bg-[hsl(var(--pulse-orange))] text-black border-[hsl(var(--pulse-orange))]' 
                : 'border-[hsl(var(--terminal-border))] text-[hsl(var(--terminal-text))] hover:bg-[hsl(var(--terminal-border))]'
              }
            `}
          >
            {sector.name}
          </Button>
        ))}
      </div>

      {/* Forecast Chart */}
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={forecastData}>
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'hsl(var(--terminal-text-dim))' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'hsl(var(--terminal-text-dim))' }}
            />
            <Line
              type="monotone"
              dataKey="baseline"
              stroke="hsl(var(--terminal-text-dim))"
              strokeWidth={1}
              strokeDasharray="5 5"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="scenario"
              stroke="hsl(var(--pulse-orange))"
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--pulse-orange))', strokeWidth: 0, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Scenario Controls */}
      <Card 
        className="p-4 border-0"
        style={{ 
          background: 'hsl(var(--terminal-bg))',
          border: '1px solid hsl(var(--terminal-border))'
        }}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h5 className="text-sm font-medium" style={{ color: 'hsl(var(--terminal-text))' }}>
              Scenario Parameters
            </h5>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={resetParams}
                className="border-[hsl(var(--terminal-border))] text-[hsl(var(--terminal-text-dim))] hover:bg-[hsl(var(--terminal-border))]"
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Reset
              </Button>
              <Button 
                size="sm"
                onClick={runSimulation}
                disabled={isRunning}
                className="bg-[hsl(var(--electric-blue))] text-black hover:bg-[hsl(var(--electric-blue-glow))]"
              >
                {isRunning ? (
                  <Zap className="h-3 w-3 mr-1 animate-pulse" />
                ) : (
                  <Play className="h-3 w-3 mr-1" />
                )}
                {isRunning ? 'Running...' : 'Run Simulation'}
              </Button>
            </div>
          </div>

          {/* Parameter Sliders */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs" style={{ color: 'hsl(var(--terminal-text-dim))' }}>
                  Supply Shock Impact
                </label>
                <span className="text-xs font-mono" style={{ color: 'hsl(var(--terminal-text))' }}>
                  {scenarioParams.supplyShock}%
                </span>
              </div>
              <Slider
                value={[scenarioParams.supplyShock]}
                onValueChange={(value) => setScenarioParams(prev => ({ ...prev, supplyShock: value[0] }))}
                max={100}
                min={-100}
                step={5}
                className="slider-terminal"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs" style={{ color: 'hsl(var(--terminal-text-dim))' }}>
                  Climate Impact
                </label>
                <span className="text-xs font-mono" style={{ color: 'hsl(var(--terminal-text))' }}>
                  {scenarioParams.climateImpact}%
                </span>
              </div>
              <Slider
                value={[scenarioParams.climateImpact]}
                onValueChange={(value) => setScenarioParams(prev => ({ ...prev, climateImpact: value[0] }))}
                max={100}
                min={-100}
                step={5}
                className="slider-terminal"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs" style={{ color: 'hsl(var(--terminal-text-dim))' }}>
                  Demand Shift
                </label>
                <span className="text-xs font-mono" style={{ color: 'hsl(var(--terminal-text))' }}>
                  {scenarioParams.demandShift}%
                </span>
              </div>
              <Slider
                value={[scenarioParams.demandShift]}
                onValueChange={(value) => setScenarioParams(prev => ({ ...prev, demandShift: value[0] }))}
                max={100}
                min={-100}
                step={5}
                className="slider-terminal"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs" style={{ color: 'hsl(var(--terminal-text-dim))' }}>
                  Policy Change
                </label>
                <span className="text-xs font-mono" style={{ color: 'hsl(var(--terminal-text))' }}>
                  {scenarioParams.policyChange}%
                </span>
              </div>
              <Slider
                value={[scenarioParams.policyChange]}
                onValueChange={(value) => setScenarioParams(prev => ({ ...prev, policyChange: value[0] }))}
                max={100}
                min={-100}
                step={5}
                className="slider-terminal"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Impact Summary */}
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <div>
            <span className="text-xs" style={{ color: 'hsl(var(--terminal-text-dim))' }}>
              Forecast Impact:
            </span>
            <div className="text-lg font-bold" style={{ 
              color: forecastData[forecastData.length - 1].scenario >= 100 
                ? 'hsl(var(--terminal-success))' 
                : 'hsl(var(--terminal-error))'
            }}>
              {((forecastData[forecastData.length - 1].scenario - 100)).toFixed(1)}%
            </div>
          </div>
          <div>
            <span className="text-xs" style={{ color: 'hsl(var(--terminal-text-dim))' }}>
              Confidence:
            </span>
            <div className="text-lg font-bold" style={{ color: 'hsl(var(--terminal-text))' }}>
              87%
            </div>
          </div>
        </div>
        
        <Button 
          size="sm" 
          variant="outline"
          className="border-[hsl(var(--terminal-border))] text-[hsl(var(--terminal-text-dim))] hover:bg-[hsl(var(--terminal-border))]"
        >
          <Download className="h-3 w-3 mr-1" />
          Export
        </Button>
      </div>
    </div>
  );
};