
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface FiltersBarProps {
  region: string;
  setRegion: (region: string) => void;
  timeRange: string;
  setTimeRange: (range: string) => void;
  assetType: string;
  setAssetType: (asset: string) => void;
  availableRegions: string[];
  availableAssetTypes: string[];
  className?: string;
}

export function FiltersBar({
  region,
  setRegion,
  timeRange,
  setTimeRange,
  assetType,
  setAssetType,
  availableRegions,
  availableAssetTypes,
  className = "",
}: FiltersBarProps) {
  return (
    <div className={cn("flex flex-col md:flex-row gap-3 items-center pb-4 px-1 animate-fade-in", className)}>
      <Select value={timeRange} onValueChange={setTimeRange}>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Time Range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1M">1M</SelectItem>
          <SelectItem value="3M">3M</SelectItem>
          <SelectItem value="6M">6M</SelectItem>
          <SelectItem value="1Y">1Y</SelectItem>
          <SelectItem value="ALL">ALL</SelectItem>
        </SelectContent>
      </Select>
      <Select value={region} onValueChange={setRegion}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Region" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All Regions</SelectItem>
          {availableRegions.map(r => (
            <SelectItem key={r} value={r}>{r}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={assetType} onValueChange={setAssetType}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Asset Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All Types</SelectItem>
          {availableAssetTypes.map(a => (
            <SelectItem key={a} value={a}>{a}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
