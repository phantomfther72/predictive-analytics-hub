import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { useDemoMode } from './useDemoMode';

export interface WatchReport {
  timestamp: string;
  status: 'healthy' | 'warning' | 'error';
  issues: Array<{
    type: 'auth' | 'payment' | 'route' | 'dashboard';
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    location?: string;
    suggestion?: string;
  }>;
  metrics: {
    criticalPathsHealthy: boolean;
    lastCheck: string;
  };
}

// Lean monitoring - only critical paths
const CRITICAL_PATHS = [
  '/auth',
  '/pricing',
  '/dashboard',
  '/housing-market',
  '/mining-market',
  '/agriculture-market',
  '/financial-market'
];

export const useContinuousWatch = () => {
  const location = useLocation();
  const { toast } = useToast();
  const { isDevMode } = useDemoMode();
  const [watchReport, setWatchReport] = useState<WatchReport | null>(null);
  const [isWatching, setIsWatching] = useState(true);
  const checkIntervalRef = useRef<NodeJS.Timeout>();

  const performHealthCheck = () => {
    const issues: WatchReport['issues'] = [];
    const currentPath = location.pathname;

    // Only monitor critical paths
    if (!CRITICAL_PATHS.includes(currentPath)) {
      return;
    }

    // Check auth elements on auth page
    if (currentPath === '/auth') {
      const signInButton = document.querySelector('button[type="submit"]');
      if (!signInButton) {
        issues.push({
          type: 'auth',
          severity: 'critical',
          description: 'Login button not found',
          location: currentPath,
          suggestion: 'Auth form may not be rendering correctly'
        });
      }
    }

    // Check pricing elements
    if (currentPath === '/pricing') {
      const pricingCards = document.querySelectorAll('[data-pricing-card]');
      if (pricingCards.length === 0) {
        issues.push({
          type: 'payment',
          severity: 'high',
          description: 'Pricing cards not found',
          location: currentPath,
          suggestion: 'Payment flow may be broken'
        });
      }
    }

    // Check dashboard rendering
    if (currentPath.includes('dashboard') || CRITICAL_PATHS.slice(3).includes(currentPath)) {
      const mainContent = document.querySelector('main');
      if (!mainContent || mainContent.children.length === 0) {
        issues.push({
          type: 'dashboard',
          severity: 'high',
          description: 'Dashboard content not rendering',
          location: currentPath,
          suggestion: 'Check data loading and component mounting'
        });
      }
    }

    // Check navbar presence
    const navbar = document.querySelector('nav');
    if (!navbar) {
      issues.push({
        type: 'route',
        severity: 'medium',
        description: 'Navigation not found',
        suggestion: 'Navigation component may not be mounted'
      });
    }

    // Generate lean report
    const report: WatchReport = {
      timestamp: new Date().toISOString(),
      status: issues.length === 0 ? 'healthy' : 
              issues.some(i => i.severity === 'critical') ? 'error' :
              issues.some(i => i.severity === 'high') ? 'warning' : 'healthy',
      issues,
      metrics: {
        criticalPathsHealthy: issues.filter(i => i.severity === 'critical' || i.severity === 'high').length === 0,
        lastCheck: new Date().toLocaleTimeString()
      }
    };

    setWatchReport(report);

    // Only alert on critical issues in critical paths
    if (isDevMode && issues.some(i => i.severity === 'critical')) {
      toast({
        title: '⚠️ Critical Issue in Core Flow',
        description: issues.find(i => i.severity === 'critical')?.description,
        variant: 'destructive'
      });
    }

    return report;
  };

  // Only check critical paths on route change
  useEffect(() => {
    if (isWatching && CRITICAL_PATHS.includes(location.pathname)) {
      performHealthCheck();
    }
  }, [location.pathname, isWatching]);

  // Less frequent checks in dev mode - every 60 seconds
  useEffect(() => {
    if (isDevMode && isWatching) {
      checkIntervalRef.current = setInterval(() => {
        if (CRITICAL_PATHS.includes(location.pathname)) {
          performHealthCheck();
        }
      }, 60000); // Check every minute instead of 30 seconds

      return () => {
        if (checkIntervalRef.current) {
          clearInterval(checkIntervalRef.current);
        }
      };
    }
  }, [isDevMode, isWatching, location.pathname]);

  return {
    watchReport,
    isWatching,
    setIsWatching,
    performHealthCheck
  };
};