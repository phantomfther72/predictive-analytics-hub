
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin } from 'lucide-react';

const NAMIBIAN_REGIONS = [
  'Khomas',
  'Erongo', 
  'Hardap',
  'Karas',
  'Kunene',
  'Ohangwena',
  'Omaheke',
  'Omusati',
  'Oshana',
  'Oshikoto',
  'Otjozondjupa',
  'Sambiu',
  'Zambezi'
];

interface RegionSelectorProps {
  selectedRegion?: string;
  onRegionSelect: (region: string) => void;
  className?: string;
}

export const RegionSelector: React.FC<RegionSelectorProps> = ({
  selectedRegion,
  onRegionSelect,
  className
}) => {
  return (
    <Select value={selectedRegion || 'all'} onValueChange={(value) => onRegionSelect(value === 'all' ? '' : value)}>
      <SelectTrigger className={className}>
        <MapPin className="h-4 w-4 mr-2 text-green-400" />
        <SelectValue placeholder="Select Region" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Regions</SelectItem>
        {NAMIBIAN_REGIONS.map((region) => (
          <SelectItem key={region} value={region}>
            {region}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
