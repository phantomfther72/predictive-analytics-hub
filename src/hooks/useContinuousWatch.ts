import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { useDemoMode } from './useDemoMode';

export interface WatchReport {
  timestamp: string;
  status: 'healthy' | 'warning' | 'error';
  issues: Array<{
    type: 'route' | 'component' | 'data' | 'navigation' | 'ui';
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    location?: string;
    suggestion?: string;
  }>;
  metrics: {
    totalPages: number;
    brokenRoutes: number;
    dataErrors: number;
    uiIssues: number;
    lastCheck: string;
  };
}

export const useContinuousWatch = () => {
  const location = useLocation();
  const { toast } = useToast();
  const { isDevMode } = useDemoMode();
  const [watchReport, setWatchReport] = useState<WatchReport | null>(null);
  const [isWatching, setIsWatching] = useState(true);
  const checkIntervalRef = useRef<NodeJS.Timeout>();

  // Route validation
  const validRoutes = [
    '/',
    '/auth',
    '/pricing',
    '/thank-you',
    '/dashboard',
    '/dashboard/industries',
    '/dashboard/predictions',
    '/dashboard/analytics',
    '/dashboard/settings',
    '/dashboard/feedback',
    '/predictive-platform',
    '/housing-market',
    '/agriculture-market',
    '/mining-market',
    '/green-hydrogen-market',
    '/financial-market',
    '/medical-market',
    '/cryptocurrency-market',
    '/global-equity',
    '/opportunities',
    '/investor-hub',
    '/terminal',
    '/profile',
    '/settings',
    '/tourism',
    '/education',
    '/infrastructure',
    '/media-entertainment',
  ];

  const performHealthCheck = () => {
    const issues: WatchReport['issues'] = [];
    const currentPath = location.pathname;

    // Check if current route is valid
    if (!validRoutes.includes(currentPath) && !currentPath.startsWith('/dashboard/')) {
      issues.push({
        type: 'route',
        severity: 'high',
        description: `Invalid route detected: ${currentPath}`,
        location: currentPath,
        suggestion: 'This route may not be properly configured in the routing system'
      });
    }

    // Check for UI rendering issues
    const mainContent = document.querySelector('main');
    if (!mainContent || mainContent.children.length === 0) {
      issues.push({
        type: 'ui',
        severity: 'critical',
        description: 'Main content area is empty',
        location: currentPath,
        suggestion: 'Check if components are properly rendered'
      });
    }

    // Check for navigation elements
    const navbar = document.querySelector('nav');
    if (!navbar) {
      issues.push({
        type: 'navigation',
        severity: 'high',
        description: 'Navigation bar not found',
        suggestion: 'Ensure navbar component is properly mounted'
      });
    }

    // Check for error boundaries
    const errorElements = document.querySelectorAll('[data-error], .error-boundary');
    errorElements.forEach(el => {
      issues.push({
        type: 'component',
        severity: 'medium',
        description: 'Error boundary triggered',
        location: el.getAttribute('data-location') || 'Unknown',
        suggestion: 'Check component for rendering errors'
      });
    });

    // Check data loading states
    const loadingElements = document.querySelectorAll('[data-loading="error"]');
    loadingElements.forEach(el => {
      issues.push({
        type: 'data',
        severity: 'medium',
        description: 'Data loading error detected',
        location: el.getAttribute('data-source') || 'Unknown',
        suggestion: 'Check API endpoints and data fetching logic'
      });
    });

    // Generate report
    const report: WatchReport = {
      timestamp: new Date().toISOString(),
      status: issues.length === 0 ? 'healthy' : 
              issues.some(i => i.severity === 'critical') ? 'error' :
              issues.some(i => i.severity === 'high') ? 'warning' : 'healthy',
      issues,
      metrics: {
        totalPages: validRoutes.length,
        brokenRoutes: issues.filter(i => i.type === 'route').length,
        dataErrors: issues.filter(i => i.type === 'data').length,
        uiIssues: issues.filter(i => i.type === 'ui').length,
        lastCheck: new Date().toLocaleTimeString()
      }
    };

    setWatchReport(report);

    // Show toast for critical issues in dev mode
    if (isDevMode && issues.some(i => i.severity === 'critical')) {
      toast({
        title: '⚠️ Critical Issue Detected',
        description: issues.find(i => i.severity === 'critical')?.description,
        variant: 'destructive'
      });
    }

    return report;
  };

  // Run health check on route change
  useEffect(() => {
    if (isWatching) {
      performHealthCheck();
    }
  }, [location.pathname, isWatching]);

  // Periodic health checks in dev mode
  useEffect(() => {
    if (isDevMode && isWatching) {
      checkIntervalRef.current = setInterval(() => {
        performHealthCheck();
      }, 30000); // Check every 30 seconds

      return () => {
        if (checkIntervalRef.current) {
          clearInterval(checkIntervalRef.current);
        }
      };
    }
  }, [isDevMode, isWatching]);

  return {
    watchReport,
    isWatching,
    setIsWatching,
    performHealthCheck
  };
};