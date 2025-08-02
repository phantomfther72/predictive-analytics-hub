import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Cpu, 
  TrendingUp, 
  Settings, 
  PlayCircle,
  StopCircle,
  Zap
} from 'lucide-react';

interface ModelConfig {
  id: string;
  name: string;
  type: 'neural' | 'regression' | 'ensemble';
  accuracy: number;
  isActive: boolean;
  isTraining: boolean;
  trainingProgress: number;
  lastTrained: string;
  parameters: Record<string, any>;
}

export const PredictiveModelsPlayground: React.FC = () => {
  const [models, setModels] = useState<ModelConfig[]>([
    {
      id: '1',
      name: 'Deep Market Predictor',
      type: 'neural',
      accuracy: 87.3,
      isActive: true,
      isTraining: false,
      trainingProgress: 0,
      lastTrained: '2h ago',
      parameters: { layers: 5, neurons: 128, dropout: 0.2 }
    },
    {
      id: '2',
      name: 'Economic Regression Model',
      type: 'regression',
      accuracy: 82.1,
      isActive: true,
      isTraining: false,
      trainingProgress: 0,
      lastTrained: '4h ago',
      parameters: { features: 15, regularization: 0.01 }
    },
    {
      id: '3',
      name: 'Ensemble Forecaster',
      type: 'ensemble',
      accuracy: 91.5,
      isActive: false,
      isTraining: true,
      trainingProgress: 67,
      lastTrained: 'Training...',
      parameters: { models: 8, voting: 'soft' }
    }
  ]);

  const toggleModel = (id: string) => {
    setModels(prev => prev.map(model => 
      model.id === id 
        ? { ...model, isActive: !model.isActive }
        : model
    ));
  };

  const startTraining = (id: string) => {
    setModels(prev => prev.map(model => 
      model.id === id 
        ? { ...model, isTraining: true, trainingProgress: 0 }
        : model
    ));
    
    // Simulate training progress
    const interval = setInterval(() => {
      setModels(prev => prev.map(model => {
        if (model.id === id && model.isTraining) {
          const newProgress = model.trainingProgress + 10;
          if (newProgress >= 100) {
            clearInterval(interval);
            return {
              ...model,
              isTraining: false,
              trainingProgress: 100,
              accuracy: model.accuracy + Math.random() * 5,
              lastTrained: 'Just now'
            };
          }
          return { ...model, trainingProgress: newProgress };
        }
        return model;
      }));
    }, 500);
  };

  const stopTraining = (id: string) => {
    setModels(prev => prev.map(model => 
      model.id === id 
        ? { ...model, isTraining: false, trainingProgress: 0 }
        : model
    ));
  };

  const getModelIcon = (type: string) => {
    switch (type) {
      case 'neural': return <Brain className="h-4 w-4" />;
      case 'regression': return <TrendingUp className="h-4 w-4" />;
      case 'ensemble': return <Cpu className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'neural': return 'hsl(var(--pulse-orange))';
      case 'regression': return 'hsl(var(--electric-blue))';
      case 'ensemble': return 'hsl(var(--terminal-success))';
      default: return 'hsl(var(--terminal-text-dim))';
    }
  };

  return (
    <div className="space-y-4">
      {/* Model Overview */}
      <div className="grid grid-cols-3 gap-4">
        <Card 
          className="p-3 border-0"
          style={{ 
            background: 'hsl(var(--terminal-bg))',
            border: '1px solid hsl(var(--terminal-border))'
          }}
        >
          <div className="text-center">
            <div className="text-lg font-bold" style={{ color: 'hsl(var(--terminal-text-bright))' }}>
              {models.filter(m => m.isActive).length}
            </div>
            <div className="text-xs" style={{ color: 'hsl(var(--terminal-text-dim))' }}>
              Active Models
            </div>
          </div>
        </Card>
        
        <Card 
          className="p-3 border-0"
          style={{ 
            background: 'hsl(var(--terminal-bg))',
            border: '1px solid hsl(var(--terminal-border))'
          }}
        >
          <div className="text-center">
            <div className="text-lg font-bold" style={{ color: 'hsl(var(--pulse-orange))' }}>
              {(models.reduce((acc, m) => acc + m.accuracy, 0) / models.length).toFixed(1)}%
            </div>
            <div className="text-xs" style={{ color: 'hsl(var(--terminal-text-dim))' }}>
              Avg Accuracy
            </div>
          </div>
        </Card>
        
        <Card 
          className="p-3 border-0"
          style={{ 
            background: 'hsl(var(--terminal-bg))',
            border: '1px solid hsl(var(--terminal-border))'
          }}
        >
          <div className="text-center">
            <div className="text-lg font-bold" style={{ color: 'hsl(var(--electric-blue))' }}>
              {models.filter(m => m.isTraining).length}
            </div>
            <div className="text-xs" style={{ color: 'hsl(var(--terminal-text-dim))' }}>
              Training
            </div>
          </div>
        </Card>
      </div>

      {/* Model List */}
      <div className="space-y-3">
        {models.map((model) => (
          <Card 
            key={model.id}
            className="p-4 border-0"
            style={{ 
              background: 'hsl(var(--terminal-card))',
              border: '1px solid hsl(var(--terminal-border))'
            }}
          >
            <div className="space-y-3">
              {/* Model Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div style={{ color: getTypeColor(model.type) }}>
                    {getModelIcon(model.type)}
                  </div>
                  <div>
                    <h6 className="font-medium" style={{ color: 'hsl(var(--terminal-text))' }}>
                      {model.name}
                    </h6>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge 
                        variant="outline"
                        className="text-xs border-[hsl(var(--terminal-border))]"
                        style={{ color: getTypeColor(model.type), borderColor: getTypeColor(model.type) }}
                      >
                        {model.type.toUpperCase()}
                      </Badge>
                      <span className="text-xs" style={{ color: 'hsl(var(--terminal-text-dim))' }}>
                        Accuracy: {model.accuracy.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Switch
                    checked={model.isActive}
                    onCheckedChange={() => toggleModel(model.id)}
                    disabled={model.isTraining}
                  />
                  {model.isTraining ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => stopTraining(model.id)}
                      className="border-[hsl(var(--terminal-error))] text-[hsl(var(--terminal-error))] hover:bg-[hsl(var(--terminal-error))] hover:text-black"
                    >
                      <StopCircle className="h-3 w-3 mr-1" />
                      Stop
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => startTraining(model.id)}
                      className="border-[hsl(var(--electric-blue))] text-[hsl(var(--electric-blue))] hover:bg-[hsl(var(--electric-blue))] hover:text-black"
                    >
                      <PlayCircle className="h-3 w-3 mr-1" />
                      Train
                    </Button>
                  )}
                </div>
              </div>

              {/* Training Progress */}
              {model.isTraining && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ color: 'hsl(var(--terminal-text-dim))' }}>
                      Training Progress
                    </span>
                    <span className="text-xs font-mono" style={{ color: 'hsl(var(--terminal-text))' }}>
                      {model.trainingProgress}%
                    </span>
                  </div>
                  <Progress 
                    value={model.trainingProgress} 
                    className="h-2"
                  />
                </div>
              )}

              {/* Model Parameters */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                {Object.entries(model.parameters).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span style={{ color: 'hsl(var(--terminal-text-dim))' }}>
                      {key.charAt(0).toUpperCase() + key.slice(1)}:
                    </span>
                    <span className="font-mono" style={{ color: 'hsl(var(--terminal-text))' }}>
                      {typeof value === 'number' ? value.toString() : value}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between">
                  <span style={{ color: 'hsl(var(--terminal-text-dim))' }}>
                    Last Trained:
                  </span>
                  <span className="font-mono" style={{ color: 'hsl(var(--terminal-text))' }}>
                    {model.lastTrained}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2">
        <Button 
          size="sm" 
          variant="outline"
          className="border-[hsl(var(--pulse-orange))] text-[hsl(var(--pulse-orange))] hover:bg-[hsl(var(--pulse-orange))] hover:text-black"
        >
          <Brain className="h-3 w-3 mr-1" />
          Deploy New Model
        </Button>
        <Button 
          size="sm" 
          variant="outline"
          className="border-[hsl(var(--electric-blue))] text-[hsl(var(--electric-blue))] hover:bg-[hsl(var(--electric-blue))] hover:text-black"
        >
          <Settings className="h-3 w-3 mr-1" />
          Optimize Parameters
        </Button>
      </div>
    </div>
  );
};