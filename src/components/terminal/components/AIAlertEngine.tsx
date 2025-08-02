import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Bell, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Zap,
  Settings,
  Plus,
  X
} from 'lucide-react';

interface Alert {
  id: string;
  title: string;
  condition: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  isActive: boolean;
  triggered: boolean;
  lastTriggered?: Date;
  threshold: number;
  currentValue: number;
}

export const AIAlertEngine: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      title: 'Copper Price Volatility',
      condition: 'Price change > 3% in 1h',
      severity: 'high',
      isActive: true,
      triggered: true,
      lastTriggered: new Date(Date.now() - 30 * 60 * 1000),
      threshold: 3,
      currentValue: 4.2
    },
    {
      id: '2',
      title: 'Agriculture Supply Chain',
      condition: 'Cross-border delays > 2 days',
      severity: 'medium',
      isActive: true,
      triggered: false,
      threshold: 2,
      currentValue: 1.5
    },
    {
      id: '3',
      title: 'Currency Correlation Break',
      condition: 'USD-NAD correlation < 0.8',
      severity: 'critical',
      isActive: true,
      triggered: true,
      lastTriggered: new Date(Date.now() - 10 * 60 * 1000),
      threshold: 0.8,
      currentValue: 0.73
    },
    {
      id: '4',
      title: 'Housing Market Anomaly',
      condition: 'Volume spike > 200%',
      severity: 'low',
      isActive: false,
      triggered: false,
      threshold: 200,
      currentValue: 145
    }
  ]);

  const toggleAlert = (id: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id 
        ? { ...alert, isActive: !alert.isActive }
        : alert
    ));
  };

  const dismissAlert = (id: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id 
        ? { ...alert, triggered: false }
        : alert
    ));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'hsl(var(--terminal-error))';
      case 'high': return 'hsl(var(--pulse-orange))';
      case 'medium': return 'hsl(var(--terminal-warning))';
      case 'low': return 'hsl(var(--electric-blue))';
      default: return 'hsl(var(--terminal-text-dim))';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="h-3 w-3" />;
      case 'high': return <Zap className="h-3 w-3" />;
      case 'medium': return <TrendingUp className="h-3 w-3" />;
      case 'low': return <Bell className="h-3 w-3" />;
      default: return <Bell className="h-3 w-3" />;
    }
  };

  const activeAlerts = alerts.filter(a => a.isActive && a.triggered);
  const totalAlerts = alerts.filter(a => a.isActive).length;

  return (
    <div className="space-y-4">
      {/* Alert Overview */}
      <div className="grid grid-cols-2 gap-4">
        <Card 
          className="p-3 border-0"
          style={{ 
            background: 'hsl(var(--terminal-bg))',
            border: '1px solid hsl(var(--terminal-border))'
          }}
        >
          <div className="text-center">
            <div className="text-lg font-bold" style={{ 
              color: activeAlerts.length > 0 ? 'hsl(var(--terminal-error))' : 'hsl(var(--terminal-success))'
            }}>
              {activeAlerts.length}
            </div>
            <div className="text-xs" style={{ color: 'hsl(var(--terminal-text-dim))' }}>
              Active Alerts
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
            <div className="text-lg font-bold" style={{ color: 'hsl(var(--terminal-text-bright))' }}>
              {totalAlerts}
            </div>
            <div className="text-xs" style={{ color: 'hsl(var(--terminal-text-dim))' }}>
              Total Rules
            </div>
          </div>
        </Card>
      </div>

      {/* Active Alerts */}
      {activeAlerts.length > 0 && (
        <div className="space-y-2">
          <h5 className="text-sm font-medium" style={{ color: 'hsl(var(--terminal-text))' }}>
            Triggered Alerts
          </h5>
          {activeAlerts.map((alert) => (
            <Card 
              key={alert.id}
              className="p-3 border-0"
              style={{ 
                background: 'hsl(var(--terminal-bg))',
                borderLeft: `3px solid ${getSeverityColor(alert.severity)}`
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div style={{ color: getSeverityColor(alert.severity) }}>
                    {getSeverityIcon(alert.severity)}
                  </div>
                  <div>
                    <div className="font-medium text-sm" style={{ color: 'hsl(var(--terminal-text))' }}>
                      {alert.title}
                    </div>
                    <div className="text-xs" style={{ color: 'hsl(var(--terminal-text-dim))' }}>
                      {alert.condition} • {alert.lastTriggered?.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => dismissAlert(alert.id)}
                  className="h-6 w-6 p-0 hover:bg-[hsl(var(--terminal-border))]"
                >
                  <X className="h-3 w-3" style={{ color: 'hsl(var(--terminal-text-dim))' }} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Alert Rules */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h5 className="text-sm font-medium" style={{ color: 'hsl(var(--terminal-text))' }}>
            Alert Rules
          </h5>
          <Button 
            size="sm" 
            variant="outline"
            className="border-[hsl(var(--pulse-orange))] text-[hsl(var(--pulse-orange))] hover:bg-[hsl(var(--pulse-orange))] hover:text-black"
          >
            <Plus className="h-3 w-3 mr-1" />
            New Rule
          </Button>
        </div>

        {alerts.map((alert) => (
          <Card 
            key={alert.id}
            className="p-3 border-0"
            style={{ 
              background: 'hsl(var(--terminal-card))',
              border: '1px solid hsl(var(--terminal-border))'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div style={{ color: getSeverityColor(alert.severity) }}>
                  {getSeverityIcon(alert.severity)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm" style={{ color: 'hsl(var(--terminal-text))' }}>
                      {alert.title}
                    </span>
                    <Badge 
                      variant="outline"
                      className="text-xs"
                      style={{ 
                        color: getSeverityColor(alert.severity),
                        borderColor: getSeverityColor(alert.severity)
                      }}
                    >
                      {alert.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="text-xs mt-1" style={{ color: 'hsl(var(--terminal-text-dim))' }}>
                    {alert.condition}
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-xs">
                    <span style={{ color: 'hsl(var(--terminal-text-dim))' }}>
                      Threshold: {alert.threshold}
                    </span>
                    <span style={{ color: 'hsl(var(--terminal-text-dim))' }}>
                      Current: {alert.currentValue}
                    </span>
                    {alert.currentValue > alert.threshold && (
                      <Badge 
                        variant="outline"
                        className="text-xs border-[hsl(var(--terminal-error))] text-[hsl(var(--terminal-error))]"
                      >
                        BREACH
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Switch
                  checked={alert.isActive}
                  onCheckedChange={() => toggleAlert(alert.id)}
                />
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
          className="border-[hsl(var(--electric-blue))] text-[hsl(var(--electric-blue))] hover:bg-[hsl(var(--electric-blue))] hover:text-black"
        >
          <Settings className="h-3 w-3 mr-1" />
          Configure
        </Button>
        <Button 
          size="sm" 
          variant="outline"
          className="border-[hsl(var(--terminal-border))] text-[hsl(var(--terminal-text-dim))] hover:bg-[hsl(var(--terminal-border))]"
        >
          <Bell className="h-3 w-3 mr-1" />
          Test Notifications
        </Button>
      </div>
    </div>
  );
};