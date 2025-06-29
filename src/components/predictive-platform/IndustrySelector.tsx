
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Industry } from '@/hooks/usePredictiveData';

interface IndustrySelectorProps {
  industries: Industry[];
  selectedIndustry?: string;
  onIndustrySelect: (industryType: string) => void;
  className?: string;
}

export const IndustrySelector: React.FC<IndustrySelectorProps> = ({
  industries,
  selectedIndustry,
  onIndustrySelect,
  className
}) => {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      <Button
        variant={!selectedIndustry ? "default" : "outline"}
        size="sm"
        onClick={() => onIndustrySelect('')}
        className={cn(
          "transition-all duration-200",
          !selectedIndustry && "bg-green-500/20 text-green-400 border-green-500/30"
        )}
      >
        All Industries
      </Button>
      
      {industries.map((industry) => (
        <Button
          key={industry.id}
          variant={selectedIndustry === industry.type ? "default" : "outline"}
          size="sm"
          onClick={() => onIndustrySelect(industry.type)}
          className={cn(
            "transition-all duration-200 flex items-center space-x-2",
            selectedIndustry === industry.type && "bg-green-500/20 text-green-400 border-green-500/30"
          )}
          style={{
            borderColor: selectedIndustry === industry.type ? industry.color : undefined,
          }}
        >
          <span className="text-sm">{industry.icon}</span>
          <span className="hidden sm:inline">{industry.name}</span>
        </Button>
      ))}
    </div>
  );
};
