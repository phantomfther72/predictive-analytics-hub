
import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface PredictionIndicatorProps {
  predictedChange?: number | null;
  predictionConfidence?: number | null;
  showIcon?: boolean;
  showLabel?: boolean;
  showConfidence?: boolean;
  variant?: "text" | "badge" | "pill";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const PredictionIndicator: React.FC<PredictionIndicatorProps> = ({
  predictedChange,
  predictionConfidence,
  showIcon = true,
  showLabel = true,
  showConfidence = true,
  variant = "text",
  size = "md",
  className = "",
}) => {
  if (predictedChange === undefined || predictedChange === null) {
    return null;
  }

  const isPositive = Number(predictedChange) > 0;
  const confidencePercentage = predictionConfidence 
    ? Math.round(predictionConfidence * 100) 
    : null;
  
  const sizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };
  
  const iconSizes = {
    sm: 12,
    md: 16,
    lg: 20,
  };
  
  const getContent = () => {
    const formattedChange = `${isPositive ? '+' : ''}${Number(predictedChange).toFixed(1)}%`;
    
    return (
      <div className="flex items-center gap-1">
        {showIcon && (isPositive 
          ? <TrendingUp size={iconSizes[size]} /> 
          : <TrendingDown size={iconSizes[size]} />
        )}
        {showLabel && <span>
          {variant === "text" ? "Predicted change: " : ""}
          {formattedChange}
        </span>}
        {showConfidence && confidencePercentage !== null && (
          <span className={`${variant === "text" ? "text-gray-500" : "opacity-80"} ml-1`}>
            {variant === "text" ? `(Confidence: ${confidencePercentage}%)` : `· ${confidencePercentage}%`}
          </span>
        )}
      </div>
    );
  };

  if (variant === "badge") {
    return (
      <Badge 
        variant={isPositive ? "default" : "destructive"}
        className={`${className} ${sizeClasses[size]}`}
      >
        {getContent()}
      </Badge>
    );
  }
  
  if (variant === "pill") {
    return (
      <div 
        className={`
          inline-flex items-center rounded-full px-2.5 py-0.5
          ${isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
          ${sizeClasses[size]} ${className}
        `}
      >
        {getContent()}
      </div>
    );
  }

  // Default text variant
  return (
    <span className={`mt-2 ${className}`}>
      <span className={`${sizeClasses[size]} font-medium flex items-center gap-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {getContent()}
      </span>
    </span>
  );
};

export default PredictionIndicator;
