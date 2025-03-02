import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HousingMarketData } from "@/types/market";
import { ArrowUpIcon, ArrowDownIcon, InfoIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HousingMarketPredictionsProps {
  data: HousingMarketData;
}

export const HousingMarketPredictions: React.FC<HousingMarketPredictionsProps> = ({
  data,
}) => {
  // Format the prediction confidence as a percentage
  const confidencePercentage = Math.round(data.prediction_confidence * 100);
  
  // Determine if the predicted change is positive, negative, or neutral
  const isPredictionPositive = (data.predicted_change || 0) > 0;
  const isPredictionNegative = (data.predicted_change || 0) < 0;
  const isPredictionNeutral = (data.predicted_change || 0) === 0;

  // Get the color based on the prediction direction
  const getPredictionColor = () => {
    if (isPredictionPositive) return "text-green-600";
    if (isPredictionNegative) return "text-red-600";
    return "text-yellow-600";
  };

  // Get the appropriate icon based on the prediction direction
  const getPredictionIcon = () => {
    if (isPredictionPositive) return <ArrowUpIcon className="h-4 w-4 text-green-600" />;
    if (isPredictionNegative) return <ArrowDownIcon className="h-4 w-4 text-red-600" />;
    return null;
  };

  // Get the badge color based on confidence level
  const getConfidenceBadgeColor = () => {
    if (confidencePercentage >= 80) return "bg-green-100 text-green-800";
    if (confidencePercentage >= 60) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  // Format the prediction timestamp
  const formatPredictionDate = () => {
    if (!data.prediction_timestamp) return "N/A";
    return new Date(data.prediction_timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get the prediction factors if available
  const getPredictionFactors = () => {
    if (!data.prediction_factors) return null;
    
    return (
      <div className="mt-4 space-y-2">
        <h4 className="text-sm font-medium">Prediction Factors:</h4>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="bg-blue-50 p-2 rounded">
            <span className="block font-medium">Market Trend</span>
            <span>{data.prediction_factors.market_trend.toFixed(2)}</span>
          </div>
          <div className="bg-purple-50 p-2 rounded">
            <span className="block font-medium">Volatility</span>
            <span>{data.prediction_factors.volatility.toFixed(2)}</span>
          </div>
          <div className="bg-amber-50 p-2 rounded">
            <span className="block font-medium">Sentiment</span>
            <span>{data.prediction_factors.sentiment.toFixed(2)}</span>
          </div>
        </div>
      </div>
    );
  };

  // Get alternative model predictions if available
  const getAlternativeModels = () => {
    const displayedModels = data.alternative_model_predictions || [];
    
    if (displayedModels.length === 0) return null;
    
    return (
      <div className="mt-6">
        <h4 className="text-sm font-medium mb-2">Alternative Model Predictions:</h4>
        <div className="space-y-2">
          {displayedModels.map((model, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded text-sm">
              <span className="font-medium capitalize">{model.model} Model</span>
              <div className="flex items-center space-x-2">
                <span className={model.value > 0 ? "text-green-600" : "text-red-600"}>
                  {model.value > 0 ? "+" : ""}{model.value.toFixed(1)}%
                </span>
                <Badge variant="outline" className="text-xs">
                  {Math.round(model.confidence * 100)}% conf.
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center justify-between">
          <span>Market Prediction</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoIcon className="h-4 w-4 text-gray-400 cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  AI-powered prediction for housing price changes in {data.region} 
                  over the next quarter, based on historical data and market factors.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Predicted Change (Next Quarter)</p>
              <div className="flex items-center mt-1">
                {getPredictionIcon()}
                <span className={`text-2xl font-bold ${getPredictionColor()}`}>
                  {data.predicted_change !== null ? (
                    <>
                      {data.predicted_change > 0 ? "+" : ""}
                      {data.predicted_change.toFixed(1)}%
                    </>
                  ) : (
                    "N/A"
                  )}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Confidence Level</p>
              <div className="mt-1">
                <Badge className={getConfidenceBadgeColor()}>
                  {confidencePercentage}% Confidence
                </Badge>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-100">
            <p className="text-sm text-gray-500">Prediction Date</p>
            <p className="font-medium">{formatPredictionDate()}</p>
          </div>

          {data.prediction_explanation && (
            <div className="pt-2 border-t border-gray-100">
              <p className="text-sm text-gray-500">Explanation</p>
              <p className="text-sm mt-1">{data.prediction_explanation}</p>
            </div>
          )}

          {getPredictionFactors()}
          {getAlternativeModels()}
        </div>
      </CardContent>
    </Card>
  );
};
