
import React from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

interface TimeRangeSliderProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function TimeRangeSlider({
  value,
  onChange,
  className
}: TimeRangeSliderProps) {
  const timeRanges = [
    { value: "1D", label: "1D" },
    { value: "7D", label: "7D" },
    { value: "1M", label: "1M" },
    { value: "3M", label: "3M" },
    { value: "6M", label: "6M" },
    { value: "1Y", label: "1Y" },
    { value: "ALL", label: "ALL" },
  ];

  return (
    <ToggleGroup
      type="single" 
      value={value}
      onValueChange={(val) => {
        if (val) onChange(val);
      }}
      className={cn("flex items-center border rounded-md bg-muted/40", className)}
    >
      {timeRanges.map((range) => (
        <ToggleGroupItem
          key={range.value}
          value={range.value}
          aria-label={`Show ${range.label} data`}
          className="px-3 py-1 text-xs data-[state=on]:bg-primary data-[state=on]:text-white"
        >
          {range.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
