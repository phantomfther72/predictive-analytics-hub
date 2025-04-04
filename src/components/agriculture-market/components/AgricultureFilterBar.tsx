
import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Filter, Download, Leaf } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

interface AgricultureFilterBarProps {
  selectedTimeframe: "1M" | "3M" | "6M" | "1Y" | "ALL";
  setSelectedTimeframe: (value: "1M" | "3M" | "6M" | "1Y" | "ALL") => void;
  selectedCropType: string;
  setSelectedCropType: (value: string) => void;
  selectedRegion: string;
  setSelectedRegion: (value: string) => void;
  cropTypes: string[];
  regions: string[];
}

export const AgricultureFilterBar: React.FC<AgricultureFilterBarProps> = ({
  selectedTimeframe,
  setSelectedTimeframe,
  selectedCropType,
  setSelectedCropType,
  selectedRegion,
  setSelectedRegion,
  cropTypes,
  regions,
}) => {
  const { toast } = useToast();
  
  const handleExportData = () => {
    toast({
      title: "Data Export Initiated",
      description: "Your Agriculture market data export is being prepared",
    });
    
    // In a real app, this would trigger a download of data
    setTimeout(() => {
      toast({
        title: "Data Export Complete",
        description: "Your data has been exported successfully",
        variant: "default",
      });
    }, 1500);
  };

  return (
    <div className="flex flex-col md:flex-row justify-between gap-4 bg-slate-50 dark:bg-slate-900/30 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-slate-500" />
          <span className="text-sm font-medium">Timeframe:</span>
          <Select value={selectedTimeframe} onValueChange={(value) => setSelectedTimeframe(value as any)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1M">1 Month</SelectItem>
              <SelectItem value="3M">3 Months</SelectItem>
              <SelectItem value="6M">6 Months</SelectItem>
              <SelectItem value="1Y">1 Year</SelectItem>
              <SelectItem value="ALL">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Leaf size={16} className="text-slate-500" />
          <span className="text-sm font-medium">Crop Type:</span>
          <Select value={selectedCropType} onValueChange={setSelectedCropType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Crop" />
            </SelectTrigger>
            <SelectContent>
              {cropTypes.map(crop => (
                <SelectItem key={crop} value={crop}>{crop}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-slate-500" />
          <span className="text-sm font-medium">Region:</span>
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Region" />
            </SelectTrigger>
            <SelectContent>
              {regions.map(region => (
                <SelectItem key={region} value={region}>{region}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button variant="outline" className="flex items-center gap-2" onClick={handleExportData}>
        <Download size={16} />
        <span>Export Data</span>
      </Button>
    </div>
  );
};
