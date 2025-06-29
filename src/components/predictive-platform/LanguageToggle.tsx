
import React from 'react';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

interface LanguageToggleProps {
  language: 'en' | 'oshiwambo';
  onLanguageChange: (lang: 'en' | 'oshiwambo') => void;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({ language, onLanguageChange }) => {
  return (
    <div className="flex items-center space-x-2 bg-slate-800/50 p-1 rounded-lg">
      <Button
        size="sm"
        variant={language === 'en' ? 'default' : 'ghost'}
        onClick={() => onLanguageChange('en')}
        className={language === 'en' ? 'bg-green-500/20 text-green-400' : 'text-slate-400'}
      >
        <Globe className="h-4 w-4 mr-1" />
        EN
      </Button>
      <Button
        size="sm"
        variant={language === 'oshiwambo' ? 'default' : 'ghost'}
        onClick={() => onLanguageChange('oshiwambo')}
        className={language === 'oshiwambo' ? 'bg-green-500/20 text-green-400' : 'text-slate-400'}
      >
        OW
      </Button>
    </div>
  );
};
