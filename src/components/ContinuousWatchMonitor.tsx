import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useContinuousWatch } from '@/hooks/useContinuousWatch';
import { useDemoMode } from '@/hooks/useDemoMode';
import { Activity, AlertTriangle, CheckCircle, XCircle, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ContinuousWatchMonitor: React.FC = () => {
  const { watchReport, isWatching, setIsWatching, performHealthCheck } = useContinuousWatch();
  const { isDevMode } = useDemoMode();
  const [isExpanded, setIsExpanded] = React.useState(false);

  if (!isDevMode) return null;

  const getStatusIcon = () => {
    if (!watchReport) return <Activity className="h-4 w-4" />;
    
    switch (watchReport.status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getStatusColor = () => {
    if (!watchReport) return 'bg-gray-100';
    
    switch (watchReport.status) {
      case 'healthy':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50';
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-md">
      {/* Compact Monitor Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${getStatusColor()} border rounded-lg p-3 shadow-lg backdrop-blur-sm bg-opacity-95`}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span className="text-sm font-medium">Watch Mode</span>
            <Badge variant={isWatching ? 'default' : 'secondary'} className="text-xs">
              {isWatching ? 'Active' : 'Paused'}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={performHealthCheck}
              className="h-7 w-7 p-0"
            >
              <RefreshCw className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-7 w-7 p-0"
            >
              {isExpanded ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        {watchReport && (
          <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
            <span>Critical Paths: {watchReport.metrics.criticalPathsHealthy ? '✓' : '✗'}</span>
            <span>•</span>
            <span>Issues: {watchReport.issues.length}</span>
            <span>•</span>
            <span>{watchReport.metrics.lastCheck}</span>
          </div>
        )}
      </motion.div>

      {/* Expanded Detail View */}
      <AnimatePresence>
        {isExpanded && watchReport && (
          <motion.div
            initial={{ opacity: 0, y: 10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: 10, height: 0 }}
            className="mt-2"
          >
            <Card className="shadow-xl">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">System Health Report</CardTitle>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="watch-toggle" className="text-xs">Auto-Watch</Label>
                    <Switch
                      id="watch-toggle"
                      checked={isWatching}
                      onCheckedChange={setIsWatching}
                      className="scale-75"
                    />
                  </div>
                </div>
                <CardDescription className="text-xs">
                  Continuous monitoring for UI and navigation integrity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-muted/50 rounded p-2">
                    <div className="text-xs text-muted-foreground">Auth Flow</div>
                    <div className="text-lg font-bold">{watchReport.issues.filter(i => i.type === 'auth').length === 0 ? '✓' : '✗'}</div>
                  </div>
                  <div className="bg-muted/50 rounded p-2">
                    <div className="text-xs text-muted-foreground">Payment</div>
                    <div className="text-lg font-bold">{watchReport.issues.filter(i => i.type === 'payment').length === 0 ? '✓' : '✗'}</div>
                  </div>
                  <div className="bg-muted/50 rounded p-2">
                    <div className="text-xs text-muted-foreground">Dashboards</div>
                    <div className="text-lg font-bold">{watchReport.issues.filter(i => i.type === 'dashboard').length === 0 ? '✓' : '✗'}</div>
                  </div>
                  <div className="bg-muted/50 rounded p-2">
                    <div className="text-xs text-muted-foreground">Routing</div>
                    <div className="text-lg font-bold">{watchReport.issues.filter(i => i.type === 'route').length === 0 ? '✓' : '✗'}</div>
                  </div>
                </div>

                {/* Issues List */}
                {watchReport.issues.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-muted-foreground">Active Issues</div>
                    <div className="max-h-48 overflow-y-auto space-y-1">
                      {watchReport.issues.map((issue, index) => (
                        <div
                          key={index}
                          className="text-xs p-2 rounded bg-muted/30 border-l-2"
                          style={{
                            borderColor: 
                              issue.severity === 'critical' ? '#ef4444' :
                              issue.severity === 'high' ? '#f59e0b' :
                              issue.severity === 'medium' ? '#3b82f6' : '#6b7280'
                          }}
                        >
                          <div className="flex items-start gap-2">
                            <Badge variant="outline" className="text-xs px-1 py-0">
                              {issue.type}
                            </Badge>
                            <div className="flex-1">
                              <div className="font-medium">{issue.description}</div>
                              {issue.location && (
                                <div className="text-muted-foreground mt-0.5">
                                  Location: {issue.location}
                                </div>
                              )}
                              {issue.suggestion && (
                                <div className="text-muted-foreground italic mt-0.5">
                                  → {issue.suggestion}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* All Clear Message */}
                {watchReport.issues.length === 0 && (
                  <div className="text-center py-4">
                    <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <div className="text-sm font-medium text-green-700">All Systems Operational</div>
                    <div className="text-xs text-muted-foreground">No issues detected</div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};