import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  TrendingUp, 
  Brain, 
  Bell, 
  Users, 
  Zap,
  BarChart3,
  Globe,
  Settings,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { LiveMarketFeed } from './components/LiveMarketFeed';
import { ForecastVisualizer } from './components/ForecastVisualizer';
import { PredictiveModelsPlayground } from './components/PredictiveModelsPlayground';
import { AIAlertEngine } from './components/AIAlertEngine';
import { InsiderDropsFeed } from './components/InsiderDropsFeed';
import { TerminalHeader } from './components/TerminalHeader';

interface TerminalWidget {
  id: string;
  title: string;
  icon: React.ReactNode;
  component: React.ReactNode;
  size: 'small' | 'medium' | 'large';
  isCollapsed?: boolean;
}

export const TerminalDashboard: React.FC = () => {
  const [widgets, setWidgets] = useState<TerminalWidget[]>([
    {
      id: 'live-feed',
      title: 'Live Market Fusion Feed',
      icon: <Activity className="h-4 w-4" />,
      component: <LiveMarketFeed />,
      size: 'large'
    },
    {
      id: 'forecast',
      title: 'Forecast Visualizer',
      icon: <TrendingUp className="h-4 w-4" />,
      component: <ForecastVisualizer />,
      size: 'large'
    },
    {
      id: 'models',
      title: 'Predictive Models Playground',
      icon: <Brain className="h-4 w-4" />,
      component: <PredictiveModelsPlayground />,
      size: 'medium'
    },
    {
      id: 'alerts',
      title: 'AI Alert Engine',
      icon: <Bell className="h-4 w-4" />,
      component: <AIAlertEngine />,
      size: 'medium'
    },
    {
      id: 'insider',
      title: 'Insider Drops Feed',
      icon: <Users className="h-4 w-4" />,
      component: <InsiderDropsFeed />,
      size: 'small'
    }
  ]);

  const toggleWidget = (id: string) => {
    setWidgets(prev => prev.map(widget => 
      widget.id === id 
        ? { ...widget, isCollapsed: !widget.isCollapsed }
        : widget
    ));
  };

  return (
    <div className="terminal min-h-screen" style={{ background: 'hsl(var(--terminal-bg))' }}>
      <div className="min-h-screen text-white">
        <TerminalHeader />
        
        {/* Status Bar */}
        <div className="px-6 py-2 border-b" style={{ 
          borderColor: 'hsl(var(--terminal-border))',
          background: 'hsl(var(--terminal-card))'
        }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="border-[hsl(var(--pulse-orange))] text-[hsl(var(--pulse-orange))]">
                <Zap className="h-3 w-3 mr-1" />
                ACTIVE
              </Badge>
              <span className="text-sm" style={{ color: 'hsl(var(--terminal-text-dim))' }}>
                InsightOS v2.1.0
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[hsl(var(--terminal-success))] animate-pulse" />
              <span className="text-xs" style={{ color: 'hsl(var(--terminal-text-dim))' }}>
                Live Data Feed
              </span>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {widgets.map((widget) => (
              <Card 
                key={widget.id}
                className={`
                  border-0 shadow-lg transition-all duration-300
                  ${widget.size === 'large' ? 'lg:col-span-8' : ''}
                  ${widget.size === 'medium' ? 'lg:col-span-6' : ''}
                  ${widget.size === 'small' ? 'lg:col-span-4' : ''}
                  ${widget.isCollapsed ? 'lg:col-span-4' : ''}
                `}
                style={{ 
                  background: 'hsl(var(--terminal-card))',
                  borderColor: 'hsl(var(--terminal-border))'
                }}
              >
                {/* Widget Header */}
                <div className="flex items-center justify-between p-4 border-b" style={{ 
                  borderColor: 'hsl(var(--terminal-border))'
                }}>
                  <div className="flex items-center gap-2">
                    <div style={{ color: 'hsl(var(--pulse-orange))' }}>
                      {widget.icon}
                    </div>
                    <h3 className="font-semibold" style={{ color: 'hsl(var(--terminal-text))' }}>
                      {widget.title}
                    </h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleWidget(widget.id)}
                    className="h-8 w-8 p-0 hover:bg-[hsl(var(--terminal-border))]"
                  >
                    {widget.isCollapsed ? (
                      <Maximize2 className="h-3 w-3" style={{ color: 'hsl(var(--terminal-text-dim))' }} />
                    ) : (
                      <Minimize2 className="h-3 w-3" style={{ color: 'hsl(var(--terminal-text-dim))' }} />
                    )}
                  </Button>
                </div>

                {/* Widget Content */}
                {!widget.isCollapsed && (
                  <div className="p-4">
                    {widget.component}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};