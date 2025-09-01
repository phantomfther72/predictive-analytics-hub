import React from 'react';
import { RoleGate } from '@/components/auth/RoleGate';
import { TerminalDashboard } from '@/components/terminal/TerminalDashboard';
import { useDemoMode } from '@/hooks/useDemoMode';
import { Badge } from '@/components/ui/badge';
import { Code, Shield } from 'lucide-react';

const Terminal = () => {
  const { isDevMode } = useDemoMode();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Dev Mode Indicator */}
      {isDevMode && (
        <div className="fixed top-20 right-4 z-50">
          <Badge className="gap-2 bg-terminal-orange text-slate-900 font-bold">
            <Code className="h-3 w-3" />
            DEV FEATURE ACTIVE
          </Badge>
        </div>
      )}
      
      <RoleGate requiredRole="pro">
        <div className="relative">
          {/* Feature Confirmation Badge */}
          <div className="absolute top-4 left-4 z-10 flex gap-2">
            <Badge variant="outline" className="gap-1 bg-terminal-cyan/10 text-terminal-cyan border-terminal-cyan/30">
              <Shield className="h-3 w-3" />
              Terminal Active
            </Badge>
            {isDevMode && (
              <Badge variant="outline" className="gap-1 bg-terminal-green/10 text-terminal-green border-terminal-green/30">
                All Features Unlocked
              </Badge>
            )}
          </div>
          
          <TerminalDashboard />
        </div>
      </RoleGate>
    </div>
  );
};

export default Terminal;