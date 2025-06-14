
import React from "react";
import { Area, Line } from "recharts";

// Draw model forecast, confidence interval etc., on a chart (for use in <ComposedChart> etc.)
export function PredictionOverlay({ data, modelKey, lowerKey, upperKey, color = "#0ea5e9", showBand = true, animationDuration = 800 }) {
  // Show shaded area for confidence, and dotted line for model forecast
  return (
    <>
      {showBand && (
        <Area
          type="monotone"
          dataKey={lowerKey}
          stroke={color}
          fill={color}
          fillOpacity={0.15}
          isAnimationActive={true}
          animationDuration={animationDuration}
          dot={false}
      />
      )}
      <Line
        type="monotone"
        dataKey={modelKey}
        stroke={color}
        strokeWidth={2}
        strokeDasharray="4 2"
        dot={false}
        isAnimationActive={true}
        animationDuration={animationDuration + 200}
        name="Forecast"
      />
    </>
  );
}
