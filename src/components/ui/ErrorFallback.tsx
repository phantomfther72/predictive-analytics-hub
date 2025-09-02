import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorFallbackProps {
  error?: Error;
  resetError?: () => void;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetError }) => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center max-w-md">
        <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
        <p className="text-muted-foreground mb-4">
          {error?.message || 'Data currently unavailable. Please refresh later.'}
        </p>
        {resetError && (
          <Button onClick={resetError} variant="outline">
            Try again
          </Button>
        )}
      </div>
    </div>
  );
};