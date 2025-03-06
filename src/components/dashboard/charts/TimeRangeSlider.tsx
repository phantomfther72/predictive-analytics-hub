
import React from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { TimeRange } from "@/types/market";

interface TimeRangeSliderProps {
  value: TimeRange;
  onChange: (value: TimeRange) => void;
}

// Map time ranges to slider positions
const TIME_RANGES: TimeRange[] = ["1D", "7D", "1M", "3M", "6M", "1Y"];

export function TimeRangeSlider({ value, onChange }: TimeRangeSliderProps) {
  const handleChange = (newValue: number[]) => {
    onChange(TIME_RANGES[newValue[0]]);
  };

  const currentIndex = TIME_RANGES.indexOf(value);

  return (
    <div className="space-y-2">
      <Label>Time Range: {value}</Label>
      <Slider
        min={0}
        max={TIME_RANGES.length - 1}
        step={1}
        value={[currentIndex]}
        onValueChange={handleChange}
        className="w-[200px]"
      />
    </div>
  );
}
