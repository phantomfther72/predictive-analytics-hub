
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useDemoMode } from '@/hooks/useDemoMode';
import { Beaker, Database } from 'lucide-react';

export const DemoModeToggle: React.FC = () => {
  const { isDemoMode, toggleDemoMode } = useDemoMode();

  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
      <div className="flex items-center gap-2">
        {isDemoMode ? (
          <Beaker className="h-4 w-4 text-orange-500" />
        ) : (
          <Database className="h-4 w-4 text-blue-500" />
        )}
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Data Source:
        </span>
      </div>
      
      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-600 dark:text-slate-400">
          Live Data
        </span>
        <Switch
          checked={isDemoMode}
          onCheckedChange={toggleDemoMode}
          className="data-[state=checked]:bg-orange-500"
        />
        <span className="text-sm text-slate-600 dark:text-slate-400">
          Demo Mode
        </span>
      </div>

      {isDemoMode && (
        <Badge variant="secondary" className="bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300">
          <Beaker className="h-3 w-3 mr-1" />
          Demo
        </Badge>
      )}
    </div>
  );
};
