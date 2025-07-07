import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  XCircle, 
  X,
  TrendingUp,
  Clock
} from 'lucide-react';

type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';
type AlertType = 'prediction' | 'market' | 'system' | 'trend';

interface PulseAlertProps {
  title: string;
  message: string;
  severity: AlertSeverity;
  type: AlertType;
  timestamp?: string;
  confidence?: number;
  onDismiss?: () => void;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const PulseAlert: React.FC<PulseAlertProps> = ({
  title,
  message,
  severity,
  type,
  timestamp,
  confidence,
  onDismiss,
  actionLabel,
  onAction,
  className
}) => {
  const getSeverityIcon = () => {
    switch (severity) {
      case 'low':
        return <Info className="h-4 w-4" />;
      case 'medium':
        return <AlertTriangle className="h-4 w-4" />;
      case 'high':
        return <AlertTriangle className="h-4 w-4" />;
      case 'critical':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getSeverityColor = () => {
    switch (severity) {
      case 'low':
        return 'border-blue-500/20 bg-blue-500/10';
      case 'medium':
        return 'border-yellow-500/20 bg-yellow-500/10';
      case 'high':
        return 'border-orange-500/20 bg-orange-500/10';
      case 'critical':
        return 'border-red-500/20 bg-red-500/10';
      default:
        return 'border-border bg-muted/50';
    }
  };

  const getBadgeColor = () => {
    switch (severity) {
      case 'low':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'high':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'critical':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'prediction':
        return <TrendingUp className="h-3 w-3" />;
      case 'market':
        return <CheckCircle className="h-3 w-3" />;
      case 'system':
        return <Info className="h-3 w-3" />;
      case 'trend':
        return <TrendingUp className="h-3 w-3" />;
      default:
        return <Info className="h-3 w-3" />;
    }
  };

  return (
    <Alert className={`${getSeverityColor()} border rounded-lg p-4 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <div className="mt-0.5">
            {getSeverityIcon()}
          </div>
          
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-semibold text-foreground">{title}</h4>
              <Badge className={`text-xs ${getBadgeColor()}`}>
                {severity.toUpperCase()}
              </Badge>
              <Badge variant="outline" className="text-xs flex items-center gap-1">
                {getTypeIcon()}
                {type}
              </Badge>
              {confidence && (
                <Badge variant="outline" className="text-xs">
                  {Math.round(confidence * 100)}% confidence
                </Badge>
              )}
            </div>
            
            <AlertDescription className="text-sm text-muted-foreground">
              {message}
            </AlertDescription>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {timestamp && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {new Date(timestamp).toLocaleString()}
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                {actionLabel && onAction && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onAction}
                    className="text-xs h-7"
                  >
                    {actionLabel}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {onDismiss && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="h-6 w-6 p-0 hover:bg-background/80"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
    </Alert>
  );
};