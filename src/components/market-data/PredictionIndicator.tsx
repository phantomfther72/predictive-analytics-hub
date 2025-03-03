
import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface PredictionIndicatorProps {
  predictedChange?: number;
  predictionConfidence?: number;
}

const PredictionIndicator: React.FC<PredictionIndicatorProps> = ({
  predictedChange,
  predictionConfidence,
}) => {
  if (predictedChange === undefined || predictionConfidence === undefined) {
    return null;
  }

  const isPositive = Number(predictedChange) > 0;
  const confidencePercentage = Math.round((predictionConfidence || 0) * 100);

  return (
    <div className="mt-2">
      <p className={`text-xs font-medium flex items-center gap-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
        Predicted change: {isPositive ? '+' : ''}{predictedChange}%
        <span className="text-gray-500 ml-1">
          (Confidence: {confidencePercentage}%)
        </span>
      </p>
    </div>
  );
};

export default PredictionIndicator;
