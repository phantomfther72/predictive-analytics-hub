import React from 'react';
import { CalendarDays, Download, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DatePickerWithRange } from '@/components/ui/date-picker-with-range';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { DateRange } from 'react-day-picker';

interface FilterControlsProps {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  selectedRegion: string;
  onRegionChange: (region: string) => void;
  selectedIndustry: string;
  onIndustryChange: (industry: string) => void;
  onRefreshData?: () => void;
  isRefreshing?: boolean;
}

export const FilterControls: React.FC<FilterControlsProps> = ({
  dateRange,
  onDateRangeChange,
  selectedRegion,
  onRegionChange,
  selectedIndustry,
  onIndustryChange,
  onRefreshData,
  isRefreshing = false
}) => {
  const { hasRole } = useAuth();
  const { toast } = useToast();

  const handleExportData = () => {
    // Simulate export functionality
    toast({
      title: "Export Started",
      description: "Your data export is being prepared and will be downloaded shortly.",
    });
    
    // In a real implementation, this would trigger an API call
    console.log('Exporting data with filters:', {
      dateRange,
      selectedRegion,
      selectedIndustry
    });
  };

  const handleRefresh = () => {
    if (onRefreshData) {
      onRefreshData();
      toast({
        title: "Data Refreshed",
        description: "Market predictions have been updated with the latest models.",
      });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between p-4 bg-card rounded-lg border">
      <div className="flex flex-col sm:flex-row gap-4 flex-1">
        {/* Date Range Picker */}
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
          <DatePickerWithRange
            date={dateRange}
            onDateChange={onDateRangeChange}
            className="w-[280px]"
          />
        </div>

        {/* Region Filter */}
        <Select value={selectedRegion} onValueChange={onRegionChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Region" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Regions</SelectItem>
            <SelectItem value="khomas">Khomas</SelectItem>
            <SelectItem value="erongo">Erongo</SelectItem>
            <SelectItem value="otjozondjupa">Otjozondjupa</SelectItem>
            <SelectItem value="hardap">Hardap</SelectItem>
            <SelectItem value="kunene">Kunene</SelectItem>
            <SelectItem value="omaheke">Omaheke</SelectItem>
            <SelectItem value="oshana">Oshana</SelectItem>
            <SelectItem value="omusati">Omusati</SelectItem>
            <SelectItem value="oshikoto">Oshikoto</SelectItem>
            <SelectItem value="ohangwena">Ohangwena</SelectItem>
            <SelectItem value="caprivi">Zambezi</SelectItem>
            <SelectItem value="karas">Karas</SelectItem>
            <SelectItem value="kavango_east">Kavango East</SelectItem>
            <SelectItem value="kavango_west">Kavango West</SelectItem>
          </SelectContent>
        </Select>

        {/* Industry Filter */}
        <Select value={selectedIndustry} onValueChange={onIndustryChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Industry" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Industries</SelectItem>
            <SelectItem value="mining">Mining</SelectItem>
            <SelectItem value="housing">Housing</SelectItem>
            <SelectItem value="agriculture">Agriculture</SelectItem>
            <SelectItem value="green_hydrogen">Green Hydrogen</SelectItem>
            <SelectItem value="financial">Financial</SelectItem>
            <SelectItem value="medical">Medical</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleExportData}
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          Export Data
        </Button>
        
        {hasRole('admin') && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh Predictions
          </Button>
        )}
      </div>
    </div>
  );
};