
import React from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface TimeRangeSliderProps {
  value: number;
  onChange: (value: number) => void;
}

const TIME_RANGES = [1, 7, 30]; // Days

export function TimeRangeSlider({ value, onChange }: TimeRangeSliderProps) {
  const handleChange = (newValue: number[]) => {
    onChange(TIME_RANGES[newValue[0]]);
  };

  const currentIndex = TIME_RANGES.indexOf(value);

  return (
    <div className="space-y-2">
      <Label>Time Range: {value} days</Label>
      <Slider
        min={0}
        max={2}
        step={1}
        value={[currentIndex]}
        onValueChange={handleChange}
        className="w-[200px]"
      />
    </div>
  );
}
