import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Code, Shield, Eye, CheckCircle } from 'lucide-react';
import { useDemoMode } from '@/hooks/useDemoMode';
import { motion } from 'framer-motion';

export const DevModeIndicator: React.FC = () => {
  const { isDevMode, isDemoMode } = useDemoMode();

  if (!isDevMode && !isDemoMode) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-20 right-4 z-50 space-y-2"
    >
      {isDevMode && (
        <Badge className="flex items-center gap-2 bg-terminal-orange text-slate-900 font-bold px-3 py-1">
          <Code className="h-4 w-4" />
          DEV MODE ACTIVE
        </Badge>
      )}
      
      {isDemoMode && (
        <Badge className="flex items-center gap-2 bg-terminal-cyan/90 text-slate-900 font-bold px-3 py-1">
          <Eye className="h-4 w-4" />
          DEMO DATA
        </Badge>
      )}

      {isDevMode && (
        <div className="bg-slate-800/90 backdrop-blur-sm rounded-lg p-3 border border-terminal-orange/30">
          <h3 className="text-xs font-bold text-terminal-orange mb-2">Features Unlocked:</h3>
          <ul className="space-y-1 text-xs text-slate-300">
            <li className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3 text-terminal-green" />
              Terminal Access
            </li>
            <li className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3 text-terminal-green" />
              All Opportunities
            </li>
            <li className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3 text-terminal-green" />
              Investor Features
            </li>
            <li className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3 text-terminal-green" />
              Live Data Feeds
            </li>
          </ul>
        </div>
      )}
    </motion.div>
  );
};