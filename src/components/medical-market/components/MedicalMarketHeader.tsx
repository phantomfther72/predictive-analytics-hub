
import React from 'react';
import { CalendarRange, Filter, RefreshCw, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TimeRange } from '@/types/market';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type MedicalMarketHeaderProps = {
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
  selectedRegion: string;
  onRegionChange: (region: string) => void;
  facilityType: string;
  onFacilityTypeChange: (type: string) => void;
};

const regions = ['All Regions', 'Windhoek', 'Walvis Bay', 'Swakopmund', 'Otjiwarongo', 'Rundu', 'Katima Mulilo'];
const facilityTypes = ['All Facilities', 'Hospital', 'Clinic', 'Emergency', 'Specialty', 'Primary'];
const timeRanges = [
  { value: '1D', label: '1 Day' },
  { value: '7D', label: '7 Days' },
  { value: '1M', label: '1 Month' },
  { value: '3M', label: '3 Months' },
  { value: '6M', label: '6 Months' },
  { value: '1Y', label: '1 Year' },
  { value: 'ALL', label: 'All Time' },
];

export const MedicalMarketHeader: React.FC<MedicalMarketHeaderProps> = ({
  timeRange,
  onTimeRangeChange,
  selectedRegion,
  onRegionChange,
  facilityType,
  onFacilityTypeChange
}) => {
  return (
    <div className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-heading font-bold text-slate-900 dark:text-white">
              Medical Assets and Services
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Healthcare metrics, capacity insights, and predictive analytics
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <Select value={selectedRegion} onValueChange={onRegionChange}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                {regions.map(region => (
                  <SelectItem key={region} value={region}>{region}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={facilityType} onValueChange={onFacilityTypeChange}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Facility Type" />
              </SelectTrigger>
              <SelectContent>
                {facilityTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <CalendarRange className="h-4 w-4" />
                  <span>{timeRanges.find(r => r.value === timeRange)?.label || timeRange}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {timeRanges.map(range => (
                  <DropdownMenuItem 
                    key={range.value} 
                    onClick={() => onTimeRangeChange(range.value as TimeRange)}
                    className={timeRange === range.value ? "bg-slate-100 dark:bg-slate-800" : ""}
                  >
                    {range.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button size="sm" variant="outline">
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
            
            <Button size="sm" variant="outline">
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
