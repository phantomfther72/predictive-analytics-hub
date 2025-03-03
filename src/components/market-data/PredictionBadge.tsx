
import React from "react";
import { PredictionFactors } from "@/types/market";
import PredictionTooltip from "./PredictionTooltip";

interface PredictionBadgeProps {
  value?: number | null;
  confidence?: number | null;
  explanation?: string | null;
  factors?: PredictionFactors | null;
  size?: "sm" | "md" | "lg";
  showConfidence?: boolean;
}

const PredictionBadge: React.FC<PredictionBadgeProps> = ({
  value,
  confidence,
  explanation,
  factors,
  size = "sm",
  showConfidence = true,
}) => {
  return (
    <PredictionTooltip
      predictedChange={value}
      predictionConfidence={confidence}
      explanation={explanation}
      factors={factors}
      variant="badge"
      size={size}
      showLabel={true}
      showIcon={size !== "sm"}
      showConfidence={showConfidence}
    />
  );
};

export default PredictionBadge;
